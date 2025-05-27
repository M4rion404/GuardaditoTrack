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
  categoria_asociada: "",
  presupuesto_asociado: ""
};

const limpiarDatos = (data) => ({
  ...data,
  categoria_asociada: data.categoria_asociada || null,
  presupuesto_asociado: data.presupuesto_asociado || null,
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

function TransaccionForm({ formData, setFormData, onSubmit, loading, error, presupuestos, categorias }) {
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
        <label htmlFor="presupuesto_asociado">Presupuesto:</label>
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
      </div>

      <div className="form-group">
        <label htmlFor="categoria_asociada">Categoria:</label>
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

const TransaccionesPresupuestos = () => {

  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("crear");
  const [filtroPresupuesto, setFiltroPresupuesto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  // Va a almacenar los presupuestos del UseEffect
  const [presupuestos, setPresupuestos] = useState([]);
  // Va a almacenar el presupuesto seleccionado
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState('');
  // Va a almacenar las categorias
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  // Va a almacenar la categoria seleccionada en el combobox
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');


  const ITEMS_PER_PAGE = 5;

  // Fetch transacciones
  const fetchTransacciones = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
      if (!token) throw new Error("No token disponible, inicia sesión.");
      const response = await fetch(
        `http://localhost:3000/api/transacciones/${userId}`,
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
      console.error("Error al cargar transacciones:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch presupuestos
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const fetchPresupuestos = async () => {
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

    fetchPresupuestos();
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

  // Fetch categorias
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const fetchCategorias = async () => {
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
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchTransacciones();
  }, []);


  // Métodos para extrar el nombre del presupuesto/categoria
  const obtenerNombresCategorias = (presupuestos) => {
    if (!Array.isArray(presupuestos)) return [];

    const nombres = presupuestos.flatMap(p =>
      Array.isArray(p.categorias) ? p.categorias.map(cat => cat.titulo) : []
    );

    return nombres;
  };

  const obtenerNombrePresupuesto = (id) => {
    const presupuesto = presupuestos.find((p) => p._id === id);
    return presupuesto?.titulo || "Sin Presupuesto";
  };

  const obtenerNombreCategoria = (categoriaAsociada) => {
    if (!categoriaAsociada) return "Sin categoría";

    const id =
      typeof categoriaAsociada === "string"
        ? categoriaAsociada
        : categoriaAsociada?._id || categoriaAsociada?.$oid;

    const categoria = categorias.find((cat) => cat._id === id);

    return categoria?.titulo || "Categoría no encontrada";
  };


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
      categoria_asociada: transaccionSeleccionada.categoria_asociada || "",
      presupuesto_asociado: transaccionSeleccionada.presupuesto_asociado || "",
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
      categoria_asociada:
        transaccion.categoria_asociada?._id ||
        transaccion.categoria_asociada ||
        "",
      presupuesto_asociado:
        transaccion.presupuesto_asociado?._id ||
        transaccion.presupuesto_asociado ||
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
    <div>

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

export default TransaccionesPresupuestos;