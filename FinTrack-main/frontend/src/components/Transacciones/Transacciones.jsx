import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaPlus, FaEdit, FaTrash, FaSyncAlt, FaSearch, FaTimes, FaFilePdf, FaEye, FaTags } from "react-icons/fa";
import "../Estilos/modalesStyles.css"
import "./Transacciones.css";

Chart.register(ArcElement, Tooltip, Legend);

// Iconos personalizados
const IconCrear = () => (
  <span role="img" aria-label="crear">
    <FaPlus style={{ color: "#388e3c" }} />
  </span>
);
const IconEditar = () => (
  <span role="img" aria-label="editar">
    <FaEdit style={{ color: "#1976d2" }} />
  </span>
);
const IconEliminar = () => (
  <span role="img" aria-label="eliminar">
    <FaTrash style={{ color: "#e53935" }} />
  </span>
);
const IconRefrescar = () => (
  <span role="img" aria-label="refrescar">
    <FaSyncAlt style={{ color: "#ffa000" }} />
  </span>
);
const IconBuscar = () => (
  <span role="img" aria-label="buscar">
    <FaSearch style={{ color: "#616161" }} />
  </span>
);
const IconCerrar = () => (
  <span role="img" aria-label="cerrar">
    <FaTimes style={{ color: "white" }} />
  </span>
);
const IconPDF = () => (
  <span role="img" aria-label="pdf">
    <FaFilePdf style={{ color: "#e53935" }} />
  </span>
);
const IconVer = () => (
  <span role="img" aria-label="ver">
    <FaEye style={{ color: "#1976d2" }} />
  </span>
);

const initialForm = {

  titulo: "",
  descripcion: "",

  accion: "",
  metodo_pago: "",
  monto: "",

  tipo_transaccion: "",
  presupuesto_asociado: "",
  categoria_asociada: "",
  meta_asociada: "",

};

const limpiarDatos = (data) => ({
  ...data,
  categoria_asociada: data.categoria_asociada || null,
  presupuesto_asociado: data.presupuesto_asociado || null,
  meta_asociada: data.meta_asociada || null
});

const validarCampos = (data) => {
  if (
    !data.titulo ||
    !data.accion ||
    !data.metodo_pago ||
    !data.monto
  ) {
    return "Por favor, complete todos los campos obligatorios.";
  }
  if (!["Ingreso", "Retiro"].includes(data.accion)) {
    return "La acción debe ser 'Ingreso' o 'Retiro'.";
  }
  if (!["Efectivo", "Tarjeta"].includes(data.metodo_pago)) {
    return "Seleccione un método de pago válido.";
  }
  if (isNaN(Number(data.monto)) || Number(data.monto) < 0) {
    return "El monto debe ser un número positivo.";
  }
  return null;
};

function TransaccionForm({ formData, setFormData, onSubmit, loading, error, presupuestos, categorias, meta_ahorro }) {
  return (
    <form onSubmit={onSubmit} className="transacciones-form">

      {/* TITULO, DESCRIPCIÓN Y TIPO DE TRANSACCIÓN */}

      <div className="form-group">

        <label htmlFor="titulo">Titulo de la Transaccion</label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, titulo: e.target.value }))
          }
          required
          placeholder="Milanesa de pollo rellena"
        />



        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, descripcion: e.target.value }))
          }
          placeholder="Cafetería del Insituto Tecnológico de Tepic"
        ></textarea>


        <label htmlFor="tipo-transaccion">Tipo de transaccion</label>
        <select
          id="tipo-transaccion"
          name="tipo-transaccion"
          value={formData.tipo_transaccion}
          disabled={formData.tipo_transaccion !== ""} 
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, tipo_transaccion: e.target.value }))
          }
        >
          <option value="">Selecciona una opción</option>
          <option value="meta">Meta de ahorro</option>
          <option value="presupuesto">Presupuesto</option>
        </select>



      </div>


      {/* 
          
          COMPONENTE QUE APARECE SU EL TIPO DE TRANSACCIÓN ES PRESUPUESTO 
          formData.tipo_transaccion === "presupuesto" && (...)
      
          Nano: Esta mafufada se lee de la siguiente manera:
          Si en el objeto fomartData la propiedad tipo de transacción
          es exáctamete "presupuestos", entonces te voy a devolver lo 
          que hay después de &&, si no pues ni modo no te doy nada. 

          Es la mamada este lenguaje, se escribe con las patas.

          Actualización: Literalmente es un if ternario
          <variable que vas a evaluar y su condicion >  " ?"   <Se cumple> : <no se cumple>
          
          Puras perras mamadas alch
          <variable que vas a evaluar y su condicion>   "&&"   <Se cumple> : <no se cumple>
          
          Si varias retornan un True hay que ponerlas en parentesis:
          (<variable que vas a evaluar y su condicion> || <variable que vas a evaluar y su condicion> ) && <Se cumple> : <no se cumple>

      */}

      {formData.tipo_transaccion === "presupuesto" && (

        <div className="form-group">

          <label htmlFor="presupuesto_asociado">Presupuesto</label>
          <select
            id="presupuesto_asociado"
            name="presupuesto_asociado"
            value={formData.presupuesto_asociado}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                presupuesto_asociado: e.target.value || "",
              }))
            }
          >
            <option value="">Seleccionar Presupuesto</option>
            {presupuestos.map((pres) => (
              <option key={pres._id} value={pres._id}>
                {pres.titulo}
              </option>
            ))}
          </select>


          <label htmlFor="categoria_asociada">Categoria</label>
          <select
            id="categoria_asociada"
            value={formData.categoria_asociada}
            onChange={(e) =>
              setFormData({ ...formData, categoria_asociada: e.target.value })
            }
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((d) => (
              <option key={d.categoria._id} value={d.categoria._id}>
                {d.categoria.titulo}
              </option>
            ))}

          </select>


        </div>

      )}

      {formData.tipo_transaccion === "meta" && (

        <div className="form-group">

          <label htmlFor="meta_asociada">Meta de ahorro</label>
          <select
            id="meta_asociada"
            name="meta_asociada"
            value={formData.meta_asociada}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                meta_asociada: e.target.value || "",
              }))
            }
          >
            <option value="">Seleccionar meta de ahorro</option>
            {meta_ahorro.map((meta) => (
              <option key={meta._id} value={meta._id}>
                {meta.nombre}
              </option>
            ))}
          </select>
        </div>

      )}


      {(formData.tipo_transaccion === "presupuesto" || formData.tipo_transaccion === "meta") && (

        <div className="form-group">


          <label htmlFor="accion">Acción</label>
          <select
            id="accion"
            name="accion"
            value={formData.accion}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, accion: e.target.value }))
            }
            required
          >
            <option value="">Seleccionar acción</option>
            <option value="Retiro">Retiro</option>
            <option value="Ingreso">Ingreso</option>
          </select>

          <label htmlFor="metodo_pago">Método de Pago</label>
          <select
            id="metodo_pago"
            name="metodo_pago"
            value={formData.metodo_pago}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, metodo_pago: e.target.value }))
            }
            required
          >
            <option value="">Seleccionar método</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
          </select>


          <label htmlFor="monto">Monto</label>
          <input
            type="number"
            id="monto"
            name="monto"
            value={formData.monto}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                monto: e.target.value,
              }))
            }
            required
            min="0"
          />


        </div>

      )}



      <div className="btn-submit-container">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

const Transacciones = () => {


  /*  Almacenar transacciones 
   *  Obtener la información de la transacción seleccionada en la tabla */
  const [transacciones, setTransacciones] = useState([]);
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState(null);

  /*  Almacenar presupuestos
   *  Filtrar presupuestos del usuario */
  const [presupuestos, setPresupuestos] = useState([]);
  const [filtroPresupuesto, setFiltroPresupuesto] = useState("");

  /*  Almacenar categorías 
   *  Filtrar categorías de un usuario
   *  Categorías filtradas del presupuesto */
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);

  /*  Almacenar metas de ahorra */
  const [meta_ahorro, setMeta_ahorro] = useState([]);

  /*  Animacion de cargar */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /*  Estado de la ventana modal (abierta:true, cerrada:false) 
   *  Modo de la modal (Crear/Editar/Ver/Eliminar) */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("crear");

  /* Controlar el menú <Más información>
     Es algo para el contenido del menú*/
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  /*  Paginación para la tabla
   *  Numero de elementos por página*/
  const [paginaActual, setPaginaActual] = useState(1);
  const ITEMS_PER_PAGE = 5;

  /*  Capturar el contenido de la barra de búsqueda */
  const [busqueda, setBusqueda] = useState("");

  /* Info */
  const [formData, setFormData] = useState(initialForm);



  /*  FETCH's para extraer las Transacciones, Categorías y Presupuestos*/
  const fetchTransacciones = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      if (!token) throw new Error("No token disponible, inicia sesión.");

      const res = await axios.get(
        `http://localhost:3000/api/transacciones/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransacciones(res.data);
      setTransaccionSeleccionada(null);
      console.log("Transacciones recibidas:", res.data.length);
    } catch (err) {
      console.error("Error al cargar transacciones:", err);
      setError(err.response?.data?.mensaje || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async (userId, token) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/categorias/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategorias(res.data);
      console.log("Categorias recibidas: ", res.data);
    } catch (error) {
      // No error visible aquí
    }
  };

  const fetchPresupuestos = async (userId, token) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/presupuestos/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPresupuestos(res.data);
      const nombresCategorias = obtenerNombresCategorias(res.data);

    } catch (error) {
      console.error("❌ Error al obtener presupuestos:", error);
    }
  };

  const fetchMetas = async (userId, token) => {
    
    try {
      const res = await axios.get(
        `http://localhost:3000/api/metas-ahorro/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMeta_ahorro(res.data);
      console.log("Metas recibidas:", res.data);
    } catch (error) {
      console.error("Error al obtener metas:", error);
    }
  };

  // Aquí se ejecutan todos los Fetch's
  useEffect(() => {

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    fetchMetas(userId, token);
    fetchPresupuestos(userId, token);
    fetchTransacciones(userId, token);
    fetchCategorias(userId, token);

  }, []);

  useEffect(() => {

    const presupuestoSeleccionado = presupuestos.find(
      (p) => p._id === formData.presupuesto_asociado
    );
    if (presupuestoSeleccionado) {
      setCategoriasFiltradas(presupuestoSeleccionado.categorias || []);
    } else {
      setCategoriasFiltradas([]);
    }

  }, [formData.presupuesto_asociado, presupuestos]);

  // Métodos para extrar el nombre del presupuesto/categoria
  const obtenerNombresCategorias = (presupuestos) => {
    if (!Array.isArray(presupuestos)) return [];

    const nombres = presupuestos.flatMap(p =>
      Array.isArray(p.categorias) ? p.categorias.map(cat => cat.titulo) : []
    );

    return nombres;
  }; // OBTENER NOMBRE DE LAS CATEGORIAS DE UN PRESUPUESTO

  const obtenerNombrePresupuesto = (id) => {
    const presupuesto = presupuestos.find((p) => p._id === id);
    return presupuesto?.titulo;
  };// OBTENER NOMBRE DE LOS PRESUPUESTOS

  const obtenerNombreMetaAhorro = (metaAsociada) => {
    if (!metaAsociada) return "Meta no asignada";

    const id = typeof metaAsociada === "string"
      ? metaAsociada
      : metaAsociada?._id || metaAsociada?.$oid;

    const meta = meta_ahorro.find((m) => m._id === id);

    return meta?.nombre || "Meta no encontrada";
  };

  const obtenerNombreCategoria = (categoriaAsociada) => {
    if (!categoriaAsociada) return "Sin categoría";

    const id =
      typeof categoriaAsociada === "string"
        ? categoriaAsociada
        : categoriaAsociada?._id || categoriaAsociada?.$oid;

    const categoria = categorias.find((cat) => cat._id === id);

    return categoria?.titulo || "Categoría no encontrada";
  };// OBTENER NOMBRE DE LAS CATEGORIAS

  // Modal handlers
  const abrirModalCrear = () => {

    setFormData(initialForm);
    setTransaccionSeleccionada(null);
    setModalMode("crear");
    setModalOpen(true);

  }; // ABRIR MODAL

  const abrirModalEditar = () => {
    if (!transaccionSeleccionada) return;

    const tipo_transaccion = transaccionSeleccionada.meta_asociada
      ? "meta"
      : transaccionSeleccionada.presupuesto_asociado
        ? "presupuesto"
        : "";

    setFormData({
      titulo: transaccionSeleccionada.titulo || "",
      descripcion: transaccionSeleccionada.descripcion || "",
      accion: transaccionSeleccionada.accion || "",
      metodo_pago: transaccionSeleccionada.metodo_pago || "",
      monto: transaccionSeleccionada.monto || "",
      categoria_asociada: transaccionSeleccionada.categoria_asociada || "",
      presupuesto_asociado: transaccionSeleccionada.presupuesto_asociado || "",
      meta_asociada: transaccionSeleccionada.meta_asociada || "",
      tipo_transaccion, // <- ahora lo fuerzas correctamente
    });

    setModalMode("editar");
    setModalOpen(true);
  }; // MODAL EDITAR

  const abrirModalVer = (transaccion) => {
    if (!transaccion)
      return;

    setTransaccionSeleccionada(transaccion);

    setFormData({

      titulo: transaccion.titulo || "",
      descripcion: transaccion.descripcion || "",
      accion: transaccion.accion || "",
      metodo_pago: transaccion.metodo_pago || "",
      monto: transaccion.monto || "",

      categoria_asociada:
        transaccion.categoria_asociada?._id ||
        transaccion.categoria_asociada ||
        "",

      presupuesto_asociado:
        transaccion.presupuesto_asociado?._id ||
        transaccion.presupuesto_asociado ||
        "",

      meta_asociada:
        transaccion.meta_asociada?._id ||
        transaccion.meta_asociada || "",

      tipo_transaccion: transaccion.tipo_transaccion

    });

    setModalMode("ver");
    setModalOpen(true);
  };

  const cerrarModal = () => {

    setModalOpen(false);
    setFormData(initialForm);
    setTransaccionSeleccionada(null);
    setError(null);

  };

  // CRUD handlers
  const handleSubmit = async (e) => {

    e.preventDefault();
    setError(null);

    const validacion = validarCampos(formData);
    if (validacion) {
      setError(validacion);
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado. Inicie sesión.");

      // Usar presupuesto_asociado del formulario como id_presupuesto
      const cleanData = {
        ...limpiarDatos(formData),
        id_presupuesto: formData.presupuesto_asociado || null,
      };

      await axios.post(
        `http://localhost:3000/api/transacciones/${userId}`,
        cleanData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Información para el backend: ", cleanData);

      await Swal.fire({
        icon: "success",
        title: "Transacción creada!",
        text: "Los datos se guardaron correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      const updatedUserId = localStorage.getItem("userId");
      const updatedToken = localStorage.getItem("token");

      fetchTransacciones(updatedUserId, updatedToken);
      cerrarModal();

    } catch (err) {
      setError(err.message);
      console.error("Error al crear transacción:", err);
      console.log("Respuesta del servidor:", err.response?.data);
      setError(err.response?.data?.mensaje || err.message);


    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    if (!transaccionSeleccionada) {
      setError("Debe seleccionar una transacción para actualizar");
      return;
    }
    const validacion = validarCampos(formData);
    if (validacion) {
      setError(validacion);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId)
        throw new Error("Sesión inválida. Por favor, inicia sesión.");
      const dataLimpia = limpiarDatos(formData);
      await axios.put(
        `http://localhost:3000/api/transacciones/${userId}/${transaccionSeleccionada._id}`,
        dataLimpia,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await Swal.fire({
        icon: "success",
        title: "Transacción actualizada!",
        text: "Los cambios se guardaron correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
      const updatedUserId = localStorage.getItem("userId");
      const updatedToken = localStorage.getItem("token");

      fetchTransacciones(updatedUserId, updatedToken);
      cerrarModal();
    } catch (err) {
      setError("Error al actualizar la transacción");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!transaccionSeleccionada) return;
    setLoading(true);
    setError(null);
    const userId = localStorage.getItem("userId");
    const resultado = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás deshacer esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (resultado.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado. Inicie sesión.");
        await axios.delete(
          `http://localhost:3000/api/transacciones/${userId}/${transaccionSeleccionada._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedUserId = localStorage.getItem("userId");
        const updatedToken = localStorage.getItem("token");

        fetchTransacciones(updatedUserId, updatedToken);
        cerrarModal();
      } catch (err) {
        setError("Error al eliminar la transaccion");
      }
    }
    setLoading(false);
  };

  const presupuestosUsados = presupuestos.filter((p) =>
    transacciones.some((t) => t.presupuesto_asociado === p._id)
  );
  const categoriasUsadas = categorias.filter((d) =>
    transacciones.some((t) => t.categoria_asociada === d._id)
  );

  // Filtro principal de transacciones
  const transaccionesFiltrados = transacciones.filter((t) => {
    const coincidePresupuesto = filtroPresupuesto
      ? t.presupuesto_asociado === filtroPresupuesto
      : true;
    const coincideCategoria = filtroCategoria
      ? t.categoria_asociada === filtroCategoria
      : true;
    const coincideBusqueda = busqueda
      ? t.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
      : true;
    return coincidePresupuesto && coincideCategoria && coincideBusqueda;
  });

  // Paginación
  const totalPaginas = Math.ceil(
    transaccionesFiltrados.length / ITEMS_PER_PAGE
  );
  const transaccionesPaginadas = transaccionesFiltrados.slice(
    (paginaActual - 1) * ITEMS_PER_PAGE,
    paginaActual * ITEMS_PER_PAGE
  );

  const irAPagina = (numPagina) => {
    if (numPagina < 1 || numPagina > totalPaginas) return;
    setPaginaActual(numPagina);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    const columnas = [
      "Título",
      "Descripción",
      "Accion",
      "Metodo de Pago",
      "Monto",
      "Categoria Asociada",
      "Presupuesto Asociado",
      "Meta de ahorro Asociada",
      "Fecha",
    ];
    const filas = transaccionesFiltrados.map((t) => [

      t.titulo || "",
      t.descripcion || "",
      t.accion || "",
      t.metodo_pago || "",
      `$${Number(t.monto || 0).toFixed(2)}`,

      obtenerNombreCategoria(t.categoria_asociada) || "",
      obtenerNombrePresupuesto(t.presupuesto_asociado) || "",
      obtenerNombreMetaAhorro(t.meta_asociada) || "",
      t.fecha ? new Date(t.fecha).toLocaleDateString() : "",

    ]);

    doc.text("Listado de transacciones", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [columnas],
      body: filas,
    });
    doc.save("transacciones.pdf");
  };


  return (

    <div className="transacciones-tabla-container">
      <div>

        {/* ENCABEZADO Y BOTÓN DE REGRESAR */}

        <div className="brine-header">
          <button
            onClick={() => (window.location.href = "/home")}
            style={{
              zIndex: 9999,
              position: "relative",
              pointerEvents: "auto",
              cursor: "pointer",
            }}
          >
            &larr; Regresar
          </button>
          <h1>
            <FaTags style={{ marginRight: "10px", marginTop: "80px" }} />
            Gestión de Transacciones Financieras
          </h1>
          <p>
            Administra tus transacciones para un mejor control de tus finanzas
            personales
          </p>
        </div>


        {error && <div className="error-message">{error}</div>}

        {/* MENÚ DESPLEGABLE ¿QUÉ PUEDES HACER EN ESTA SECCIÓN? */}

        <div className="brine-intro">
          <h2 onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
            ¿Qué puedes en transacciones?
            <span
              style={{
                display: "inline-block",
                marginLeft: "8px",
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease"
              }}
            >
              ▶
            </span>
          </h2>

          <div
            ref={contentRef}
            className="brine-intro-content"
            style={{
              maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
              opacity: isOpen ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 0.5s ease, opacity 0.4s ease"
            }}
          >
            <div className="intro-box">
              <p>
                Esta sección te permite <strong>crear nuevas transacciones</strong>, organizar tus
                finanzas y visualizar rápidamente tus registros.
              </p>

              <p>
                Las transacciones son la forma en que puedes mover dinero entre tus
                presupuestos o metas de ahorro, generando un <em>gasto</em> o un <em>ingreso</em> según tu necesidad.
              </p>

              <div className="example-box">
                <p><strong>Ejemplo:</strong></p>
                <p>
                  Supongamos que creas un presupuesto llamado <strong>“Gastos Escolares”</strong> con un
                  límite de <strong>$1,000 pesos</strong> y un periodo quincenal. Este límite se divide en:
                </p>
                <ul>
                  <li>Transporte: $200</li>
                  <li>Alimentos: $800</li>
                </ul>
                <p>
                  Si compras comida por <strong>$120</strong>, podrás registrar esa transacción
                  para saber cuánto te queda disponible en la categoría correspondiente.
                  Así generas una bitácora financiera precisa.
                </p>
              </div>

              <p><strong>En resumen:</strong></p>
              <ul className="summary-list">
                <li>Crea transacciones personalizadas que afectan tus presupuestos o metas.</li>
                <li>Edita transacciones y refleja los cambios automáticamente.</li>
                <li>Elimina transacciones cuando sea necesario.</li>
                <li>Gestiona todas tus transacciones a lo largo del tiempo.</li>
                <li>Exporta tu información a PDF si lo necesitas.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>


      {/* CRUD, BARRA DE BÚSQUEDA Y FILTROS */}

      <div className="acciones-superiores">
        <button
          className="btn-icon-crear"
          onClick={abrirModalCrear}
          title="Crear"
        >
          <IconCrear /> Crear
        </button>

        <button
          className="btn-icon-Detalles"
          onClick={() => abrirModalVer(transaccionSeleccionada)}
          disabled={!transaccionSeleccionada}
          title="Detalles"
        >
          <IconVer /> Detalles
        </button>

        <button
          className="btn-icon-Editar"
          onClick={abrirModalEditar}
          disabled={!transaccionSeleccionada}
          title="Editar"
        >
          <IconEditar /> Editar
        </button>

        <button
          className="btn-icon-Eliminar"
          onClick={handleDelete}
          disabled={!transaccionSeleccionada}
          title="Eliminar"
        >
          <IconEliminar /> Eliminar
        </button>

        <button
          className="btn-icon-Refrescar"
          onClick={fetchTransacciones}
          title="Refrescar"
        >
          <IconRefrescar /> Refrescar
        </button>

        <button
          className="btn-icon-PDF"
          onClick={exportarPDF}
          title="Exportar PDF"
        >
          <IconPDF /> PDF
        </button>

        <div className="buscador-container">
          <IconBuscar />
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

      </div>

      {/* TABLA */}

      <table className="transacciones-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Accion</th>
            <th>Monto</th>
            <th>Nombre entidad </th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {transaccionesPaginadas.map((transaccion) => {

            return (
              <tr
                key={transaccion._id}
                onClick={() => setTransaccionSeleccionada(transaccion)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    transaccionSeleccionada?._id === transaccion._id
                      ? "#e0f7fa"
                      : "transparent",
                }}
              >
                <td>{transaccion.titulo}</td>
                <td>{transaccion.accion}</td>
                <td>${Number(transaccion.monto || 0).toFixed(2)}</td>
                <td>
                  {transaccion.presupuesto_asociado
                    ? obtenerNombrePresupuesto(transaccion.presupuesto_asociado)
                    : obtenerNombreMetaAhorro(transaccion.meta_asociada)}
                </td>

                <td> {transaccion.presupuesto_asociado ? "Presupuesto" : "Meta de ahorro"} </td>
              </tr>
            );
          })}
        </tbody>
      </table>


      {/* PAGINACIÓN */}

      <div className="pagination">
        <button
          onClick={() => irAPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          &laquo; Anterior
        </button>
        {[...Array(totalPaginas)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => irAPagina(i + 1)}
            style={{
              fontWeight: paginaActual === i + 1 ? "bold" : "normal",
              textDecoration: paginaActual === i + 1 ? "underline" : "none",
            }}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => irAPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente &raquo;
        </button>
      </div>

      {/* MODALES */}

      {modalOpen && (
        <div className="modal-overlay"
        onClick={(e) => {
      // Si haces clic exactamente en el overlay (no en el contenido)
      if (e.target.classList.contains("modal-overlay")) {
        cerrarModal();
      }
    }}
        >
          <div className="modal-content">
            <button className="modal-close" onClick={cerrarModal}>
              <IconCerrar />
            </button>


            {modalMode === "crear" && (
              <>
                <h2>Crear Transaccion</h2>
                <TransaccionForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  loading={loading}
                  error={error}
                  presupuestos={presupuestos}
                  categorias={categoriasFiltradas}
                  meta_ahorro={meta_ahorro}
                />
              </>
            )}


            {modalMode === "editar" && (
              <>
                <h2>Editar Transaccion</h2>
                <TransaccionForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleUpdate}
                  loading={loading}
                  error={error}
                  presupuestos={presupuestos}
                  categorias={categoriasFiltradas}
                  meta_ahorro={meta_ahorro}
                />
              </>
            )}


            {modalMode === "ver" && formData && (
              <>
                <h2>Detalles de la Transaccion</h2>
                <div className="detalle-transaccion">
                  <p>
                    <strong>Título: </strong> {formData.titulo}
                  </p>
                  <p>
                    <strong>Descripción: </strong> {formData.descripcion}
                  </p>
                  <p>
                    <strong>Accion: </strong> {formData.accion}
                  </p>
                  <p>
                    <strong>Metodo de Pago: </strong> {formData.metodo_pago}
                  </p>
                  <p>
                    <strong>Monto: </strong> $
                    {Number(formData.monto).toFixed(2)}
                  </p>
                  <p>
                    <strong>Categoria:</strong>{" "}
                    {transaccionSeleccionada?.categoria_asociada
                      ? obtenerNombreCategoria(
                        transaccionSeleccionada.categoria_asociada
                      )
                      : "No asignada"}
                  </p>
                  <p>
                    <strong>Presupuesto:</strong>{" "}
                    {transaccionSeleccionada?.presupuesto_asociado
                      ? obtenerNombrePresupuesto(
                        transaccionSeleccionada.presupuesto_asociado
                      )
                      : "No asignada"}
                  </p>
                  <p> <strong> Fecha de Creación: </strong> {transaccionSeleccionada.fecha
                    ? new Date(transaccionSeleccionada.fecha).toLocaleDateString()
                    : ""} </p>
                </div>
              </>
            )}


            {modalMode === "verMeta" && formData && (
              <>
                <h2>Detalles de la Transaccion</h2>
                <div className="detalle-transaccion">
                  <p>
                    <strong>Título: </strong> {formData.titulo}
                  </p>
                  <p>
                    <strong>Descripción: </strong> {formData.descripcion}
                  </p>
                  <p>
                    <strong>Accion: </strong> {formData.accion}
                  </p>
                  <p>
                    <strong>Metodo de Pago: </strong> {formData.metodo_pago}
                  </p>
                  <p>
                    <strong>Monto: </strong> $
                    {Number(formData.monto).toFixed(2)}
                  </p>
                  <p>
                    <strong>Categoria:</strong>{" "}
                    {transaccionSeleccionada?.categoria_asociada
                      ? obtenerNombreCategoria(
                        transaccionSeleccionada.categoria_asociada
                      )
                      : "No asignada"}
                  </p>
                  <p>
                    <strong>Presupuesto:</strong>{" "}
                    {transaccionSeleccionada?.presupuesto_asociado
                      ? obtenerNombrePresupuesto(
                        transaccionSeleccionada.presupuesto_asociado
                      )
                      : "No asignada"}
                  </p>
                  <p> <strong> Fecha de Creación: </strong> {transaccionSeleccionada.fecha
                    ? new Date(transaccionSeleccionada.fecha).toLocaleDateString()
                    : ""} </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}


    </div>
  )
};

export default Transacciones;