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
  meta_ahorro_asociada: "",
};

const limpiarDatos = (data) => ({
  ...data,
  meta_ahorro_asociada: data.meta_ahorro_asociada || null
});

const validarCampos = (data) => {
  
  if ( !data.titulo || !data.accion || !data.metodo_pago || !data.monto) 
    return "Por favor, complete todos los campos obligatorios.";
  
  if (!["Ingreso", "Retiro"].includes(data.accion)) 
    return "La acción debe ser 'Ingreso' o 'Retiro'.";
  
  if (!["Efectivo", "Tarjeta"].includes(data.metodo_pago)) 
    return "Seleccione un método de pago válido.";
  
  if (isNaN(Number(data.monto)) || Number(data.monto) < 0) 
    return "El monto debe ser un número positivo.";
  
  return null;
};

function TransaccionForm({ formData, setFormData, onSubmit, loading, error, metas_ahorro }) {
  return (
    <form onSubmit={onSubmit} className="transacciones-form">
      <div className="form-group">
        <label htmlFor="titulo">Titulo de la Transaccion:</label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, titulo: e.target.value }))
          }
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, descripcion: e.target.value }))
          }
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="meta_ahorro_asociado">Meta de Ahorro</label>
        <select
          id="meta_ahorro_asociado"
          name="meta_ahorro_asociado"
          value={formData.meta_ahorro_asociado}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              meta_ahorro_asociado: e.target.value || "",
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
      </div>
      <div className="form-group">
        <label htmlFor="accion">Acción:</label>
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
      </div>
      <div className="form-group">
        <label htmlFor="metodo_pago">Método de Pago:</label>
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
      </div>
      <div className="form-group">
        <label htmlFor="monto">Monto:</label>
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
      <div className="btn-submit-container">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

const Transacciones_Ahorros = () => {

  // UseState's para el control de las transacciones
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState(null);
  const [transacciones, setTransacciones] = useState([]);
  
  // UseState para metas de ahorro
  const [filtroMeta, setFiltroMeta] = useState("");

  // UseState's para animaciones de carga y error 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // UseState's para el estado de las modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("crear");
  
  // UseState para la barra de busqueda
  const [busqueda, setBusqueda] = useState("");
  
  // UseState que inicializa los campos de formulario modal
  const [formData, setFormData] = useState(initialForm);
  
  // UseState's para controlar la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const ITEMS_PER_PAGE = 5; // Variable que limita el número de elementos en la tabla

  const contentRef = useRef(null);


  // Trae todas las transacciones hechas a las metas de ahorro
  const fetchTransacciones = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
      if (!token) throw new Error("No token disponible, inicia sesión.");
      const response = await fetch(
        `http://localhost:3000/api/transacciones/meta-ahorro/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        const errorMessage = await response.text(); // Esto ayuda a ver si hay HTML o texto de error
        throw new Error(`Error del servidor: ${response.status} - ${errorMessage}`);
      }
      const data = await response.json();
      setTransacciones(data);
      setTransaccionSeleccionada(null);

      // Error: estabas intentando acceder a response.data, pero response es la respuesta fetch
      // y data ya contiene los datos. Cambia esto por:
      console.log("Transacciones recibidas:", data.length);

    } catch (err) {
      setError(err.message);
      console.error("Error al cargar transacciones de meta de ahorros:", err);
    } finally {
      setLoading(false);
    }
  };

  // Trae todas las metas de ahorro
  const fetchMetas = async (token, userId) => {
      
    try {
        const res = await axios.get( 
          `http://localhost:3000/api/metas-ahorro/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMetas(res.data);
        console.log("<< METAS DE AHORRO >> Se han recuperado los siguientes datos: ", res.data);
      } catch (error) {
        console.error("<< METAS DE AHORRO >> Ha ocurrido un error al obtener los datos:", error);
      }
    };

  const obtenerNombreMeta = (userId) => {

    // .find(): Buscar en el arreglo 
    // La variable dentro es un alias para cada elemento del arreglo
    const meta = metas_ahorro.find( (ahorro) => ahorro._id === id );
    return meta?.titulo || "Sin meta de ahorro";
    
  };
  
  // Fetch Metas de ahorro
  useEffect(() => {
    
    // Infomación del usuario para las peticiones
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    fetchMetas(token, userId);
    
  }, []);

  // Modal handlers
  const abrirModalCrear = () => {
    setFormData(initialForm);
    setTransaccionSeleccionada(null);
    setModalMode("crear");
    setModalOpen(true);
  };

  const abrirModalEditar = () => {
    if (!transaccionSeleccionada) return;
    setFormData({
      titulo: transaccionSeleccionada.titulo || "",
      descripcion: transaccionSeleccionada.descripcion || "",
      accion: transaccionSeleccionada.accion || "",
      metodo_pago: transaccionSeleccionada.metodo_pago || "",
      monto: transaccionSeleccionada.monto || "",
      meta_ahorro_asociada: transaccionSeleccionada.meta_ahorro_asociada || "",
    });
    setModalMode("editar");
    setModalOpen(true);
  };

  const abrirModalVer = (transaccion) => {
    if (!transaccion) return;
    setTransaccionSeleccionada(transaccion);
    setFormData({
      titulo: transaccion.titulo || "",
      descripcion: transaccion.descripcion || "",
      accion: transaccion.accion || "",
      metodo_pago: transaccion.metodo_pago || "",
      monto: transaccion.monto || "",
      meta_ahorro_asociada:
        transaccion.meta_ahorro_asociada?._id ||
        transaccion.meta_ahorro_asociada ||
        "",
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

      const cleanData = {
        ...limpiarDatos(formData),
        id_meta_ahorro_asociada: formData.id_meta_ahorro_asociada || null,
      };

      await axios.post(
        `http://localhost:3000/api/transacciones/${userId}`,
        cleanData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        icon: "success",
        title: "Transacción creada!",
        text: "Los datos se guardaron correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchTransacciones();
      cerrarModal();

    } catch (err) {
      setError(err.message);
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
      fetchTransacciones();
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
        fetchTransacciones();
        cerrarModal();
      } catch (err) {
        setError("Error al eliminar la transaccion");
      }
    }
    setLoading(false);
  };

  const metasAhorrosUsadas = metas_ahorro.filter((p) =>
    transacciones.some((t) => t.meta_ahorro_asociada === p._id)
  );

  // Filtro principal de transacciones
  const transaccionesFiltrados = transacciones.filter((t) => {
    const coincideMetaAhorro = filtroMeta
      ? t.meta_ahorro_asociada === meta_ahorro_asociada
      : true;
    const coincideBusqueda = busqueda
      ? t.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
      : true;
    return coincideMetaAhorro && coincideBusqueda;
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
      "Meta de ahorro asociada",
      "Fecha",
    ];
    const filas = transaccionesFiltrados.map((t) => [
      t.titulo || "",
      t.descripcion || "",
      t.accion || "",
      t.metodo_pago || "",
      `$${Number(t.monto || 0).toFixed(2)}`,
      obtenerNombrePresupuesto(t.meta_ahorro_asociada) || "",
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

      <div className="acciones-superiores">
        <button
          className="btn-icon-crear"
          onClick={abrirModalCrear}
          title="Crear"
        >
          <IconCrear /> Presupuestos
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
        <div className="Filtros">
          <select
            value={filtroPresupuesto}
            onChange={(e) => setFiltroPresupuesto(e.target.value)}
          >
            <option value="">Todos los presupuestos</option>
            {presupuestosUsados.map((p) => (
              <option key={p._id} value={p._id}>
                {p.titulo}
              </option>
            ))}
          </select>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="">Todas las categorias</option>
            {categoriasUsadas.map((d) => (
              <option key={d._id} value={d._id}>
                {d.titulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="transacciones-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Accion</th>
            <th>Monto</th>
            <th>Presupuesto</th>
            <th>Categoria</th>
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
                  {obtenerNombrePresupuesto(transaccion.presupuesto_asociado)}
                </td>
                <td>{obtenerNombreCategoria(transaccion?.categoria_asociada)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Controles de paginación */}
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

      {modalOpen && (
        <div className="modal-overlay">
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
                  categorias={categorias}
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
  );
};

export default Transacciones_Ahorros;


