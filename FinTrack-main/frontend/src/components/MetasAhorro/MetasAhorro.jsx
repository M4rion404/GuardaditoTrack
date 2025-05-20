import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaSearch,
  FaTimes,
  FaFilePdf,
  FaEye,
  FaTags,
} from "react-icons/fa";
import "./MetasAhorro.css";

Chart.register(ArcElement, Tooltip, Legend);

// Iconos personalizados
const IconCrear = () => <FaPlus style={{ color: "#388e3c" }} />;
const IconEditar = () => <FaEdit style={{ color: "#1976d2" }} />;
const IconEliminar = () => <FaTrash style={{ color: "#e53935" }} />;
const IconRefrescar = () => <FaSyncAlt style={{ color: "#ffa000" }} />;
const IconBuscar = () => <FaSearch style={{ color: "#616161" }} />;
const IconCerrar = () => <FaTimes style={{ color: "#757575" }} />;
const IconPDF = () => <FaFilePdf style={{ color: "#e53935" }} />;
const IconVer = () => <FaEye style={{ color: "#1976d2" }} />;

const initialForm = {
  nombre: "",
  descripcion: "",
  objetivo: "",
  fecha_limite: "",
  estado: "",
};

const limpiarDatos = (data) => ({
  ...data,
  divisa_asociada: data.divisa_asociada || null,
  presupuesto_asociado: data.presupuesto_asociado || null,
});

const validarCampos = (data) => {
  // Validación de campos requeridos
  if (
    !data.nombre ||
    !data.objetivo ||
    !data.fecha_limite ||
    !data.estado 
  ) {
    return "Por favor, complete todos los campos obligatorios.";
  }
  // Validar objetivo
 if (isNaN(Number(data.objetivo)) || Number(data.objetivo) < 0) {
    return "El objetivo debe ser un número positivo.";
  }
  return null;


  // Validar método de pago

  // Validar estado
  if (!["Ahorrando", "Completada"].includes(data.estado)) {
    return "Seleccione un estado válido.";
  }
  // Validar objetivo
};

// Formulario reutilizable para crear/editar
function MetaAhorroForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  error
}) {
  return (
    <form onSubmit={onSubmit} className="metaAhorro-form">
      <div className="form-group">
        <label htmlFor="nombre">nombre de la meta de ahorro:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, nombre: e.target.value }))
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
        <label htmlFor="objetivo">Objetivo:</label>
        <input
          type="number"
          id="objetivo"
          name="objetivo"
          value={formData.objetivo}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              objetivo: e.target.value,
            }))
          }
          required
          min="0"
        />
      </div>
      
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

const MetasAhorro = () => {
  const [metaAhorro, setmetaAhorro] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metaAhorroSeleccionada, setmetaAhorroSeleccionada] = useState(null);
  const [divisas, setDivisas] = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("crear"); // crear | editar | ver
  const [filtroPresupuesto, setFiltroPresupuesto] = useState("");
  const [filtroDivisa, setFiltroDivisa] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [formData, setFormData] = useState(initialForm);

  const ITEMS_PER_PAGE = 5;

  // Fetch metaAhorro
  const fetchmetaAhorro = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      if (!token) throw new Error("No token disponible, inicia sesión.");
      const response = await fetch(
        `http://localhost:3000/api/metasahorro/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Error al obtener las metaAhorro");

      const data = await response.json();
      setmetaAhorro(data);
      setmetaAhorroSeleccionada(null); // <- Limpia la selección
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchmetaAhorro();
    // eslint-disable-next-line
  }, []);

  // Modal handlers
  const abrirModalCrear = () => {
    setFormData(initialForm);
    setmetaAhorroSeleccionada(null);
    setModalMode("crear");
    setModalOpen(true);
  };

  const abrirModalEditar = () => {
    if (!metaAhorroSeleccionada) return;
    setFormData({
      nombre: metaAhorroSeleccionada.nombre || "",
      descripcion: metaAhorroSeleccionada.descripcion || "",
      objetivo: metaAhorroSeleccionada.objetivo || "",
      fecha_limite: metaAhorroSeleccionada.fecha_limite || "",
      estado: metaAhorroSeleccionada.estado || "",
    });
    setModalMode("editar");
    setModalOpen(true);
  };

  const abrirModalVer = (metaAhorro) => {
    if (!metaAhorro) return;
    setmetaAhorroSeleccionada(metaAhorro);
    setFormData({
      nombre: metaAhorro.nombre || "",
      descripcion: metaAhorro.descripcion || "",
      objetivo: metaAhorro.objetivo || "",
      fecha_limite: metaAhorro.fecha_limite || "",
      estado: metaAhorro.estado || "",
    });
    setModalMode("ver");
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setFormData(initialForm);
    setmetaAhorroSeleccionada(null);
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
    const userId = localStorage.getItem("userId");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado. Inicie sesión.");
      const cleanData = limpiarDatos(formData);
      await axios.post(
        `http://localhost:3000/api/metasahorro/${userId}`,
        cleanData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await Swal.fire({
        icon: "success",
        title: "Meta creada",
        text: "Los datos se guardaron correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchmetaAhorro();
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

    if (!metaAhorroSeleccionada) {
      console.error("No hay transacción seleccionada");
      setError("Debe seleccionar una transacción para actualizar");
      return;
    }

    console.log("Transacción seleccionada:", metaAhorroSeleccionada);

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

      console.log("ID transacción seleccionada:", metaAhorroSeleccionada._id);

      const dataLimpia = limpiarDatos(formData);

      await axios.put(
        `http://localhost:3000/api/metasahorro/${userId}/${metaAhorroSeleccionada._id}`,
        dataLimpia,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        icon: "success",
        title: "Meta actualizada",
        text: "Los cambios se guardaron correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchmetaAhorro();
      cerrarModal();
    } catch (err) {
      console.error(err);
      setError("Error al actualizar la transacción");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!metaAhorroSeleccionada) return;
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
          `http://localhost:3000/api/metas-ahorro/${userId}/${metaAhorroSeleccionada._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchmetaAhorro();
        cerrarModal();
      } catch (err) {
        setError("Error al eliminar la metaAhorro");
      }
    }
    setLoading(false);
  };

  const presupuestosUsados = presupuestos.filter((p) =>
    metaAhorro.some((t) => t.presupuesto_asociado === p._id)
  );

  const divisasUsadas = divisas.filter((d) =>
    metaAhorro.some((t) => t.divisa_asociada === d._id)
  );

  // Filtro principal de metaAhorro
  const metaAhorroFiltrados = metaAhorro.filter((t) => {
    const coincidePresupuesto = filtroPresupuesto
      ? t.presupuesto_asociado === filtroPresupuesto
      : true;

    const coincideDivisa = filtroDivisa
      ? t.divisa_asociada === filtroDivisa
      : true;

      const coincideBusqueda = busqueda
    ? t.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.objetivo?.toLowerCase().includes(busqueda.toLowerCase())
    : true;

    return coincidePresupuesto && coincideDivisa && coincideBusqueda;
  });

  // Paginación
  const totalPaginas = Math.ceil(
    metaAhorroFiltrados.length / ITEMS_PER_PAGE
  );

  const metaAhorroPaginadas = metaAhorroFiltrados.slice(
    (paginaActual - 1) * ITEMS_PER_PAGE,
    paginaActual * ITEMS_PER_PAGE
  );

  // Ir a página específica
  const irAPagina = (numPagina) => {
    if (numPagina < 1 || numPagina > totalPaginas) return;
    setPaginaActual(numPagina);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    const columnas = [
      "Título",
      "Descripción",
      "Objetivo",
      "Fecha Limite",
      "Estado",
      "Fecha",
    ];
    const filas = metaAhorroFiltrados.map((t) => [
      t.nombre || "",
      t.descripcion || "",
      `$${Number(t.objetivo || 0).toFixed(2)}`,
      t.fecha_limite || "",
      t.estado || "",
      t.fecha ? new Date(t.fecha).toLocaleDateString() : "",
    ]);
    doc.text("Listado de Metas de Ahorro", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [columnas],
      body: filas,
    });
    doc.save("Metas_de_Ahorro.pdf");
  };

  return (
    <div className="metaAhorro-tabla-container">
      <div>
        <div className="brine-header">
          <button
            onClick={() => (window.location.href = "/home")}
            style={{ zIndex: 9999, position: "relative", pointerEvents: "auto", cursor: "pointer" }}
          >
            &larr; Regresar
          </button>
          <h1>
            <FaTags style={{ marginRight: "10px", marginTop: "80px" }} />
            Gestión de Metas de Ahorro
          </h1>
          <p>
            Administra tus Metas de Ahorro
          </p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="brine-intro">
          <h2>¿Qué puedes hacer aquí?</h2>
          <p>
            Esta sección te permite crear nuevas Metas, organizarlas y visualizarlas rápidamente.
          </p>
          <ul>
            <li>Crear una nueva meta.</li>
            <li>Gestionar metas creadas.</li>
          </ul>
        </div>
      </div>

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
          onClick={() => abrirModalVer(metaAhorroSeleccionada)}
          disabled={!metaAhorroSeleccionada}
          title="Detalles"
        >
          <IconVer /> Detalles
        </button>
        <button
          className="btn-icon-Editar"
          onClick={abrirModalEditar}
          disabled={!metaAhorroSeleccionada}
          title="Editar"
        >
          <IconEditar /> Editar
        </button>
        <button
          className="btn-icon-Eliminar"
          onClick={handleDelete}
          disabled={!metaAhorroSeleccionada}
          title="Eliminar"
        >
          <IconEliminar /> Eliminar
        </button>
        <button
          className="btn-icon-Refrescar"
          onClick={fetchmetaAhorro}
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
                {p.nombre}
              </option>
            ))}
          </select>

          <select
            value={filtroDivisa}
            onChange={(e) => setFiltroDivisa(e.target.value)}
          >
            <option value="">Todas las divisas</option>
            {divisasUsadas.map((d) => (
              <option key={d._id} value={d._id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="metaahorro-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Objetivo</th>
            <th>Fecha Limite</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {metaAhorroPaginadas.map((metaAhorro) => {
            return (
              <tr
                key={metaAhorro._id}
                onClick={() => setmetaAhorroSeleccionada(metaAhorro)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    metaAhorroSeleccionada?._id === metaAhorro._id
                      ? "#e0f7fa"
                      : "transparent",
                }}
              >
                <td>{metaAhorro.nombre}</td>
                <td>{metaAhorro.descripcion}</td>
                <td>${Number(metaAhorro.objetivo || 0).toFixed(2)}</td>
                <td>{metaAhorro.fecha_limite}</td>
                <td>{metaAhorro.progreso_actual}</td>
                <td>{metaAhorro.estado}</td>
                <td>
                  {metaAhorro.fecha
                    ? new Date(metaAhorro.fecha).toLocaleDateString()
                    : ""}
                </td>
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
                <h2>Crear metaAhorro</h2>
                <MetaAhorroForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  loading={loading}
                  error={error}
                  presupuestos={presupuestos}
                  divisas={divisas}
                />
              </>
            )}
            {modalMode === "editar" && (
              <>
                <h2>Editar metaAhorro</h2>
                <MetaAhorroForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleUpdate}
                  loading={loading}
                  error={error}
                  presupuestos={presupuestos}
                />
              </>
            )}
            {modalMode === "ver" && formData && (
              <>
                <h2>Detalles de la metaAhorro</h2>
                <div className="detalle-metaAhorro">
                  <p>
                    <strong>Título: </strong> {formData.nombre}
                  </p>
                  <p>
                    <strong>Descripción: </strong> {formData.objetivo}
                  </p>
                  <p>
                    <strong>Objetivo: </strong> $
                    {Number(formData.objetivo).toFixed(2)}
                  </p>
                  <p>
                    <strong>fecha_limite: </strong> {formData.fecha_limite}
                  </p>
                  <p>
                    <strong>Estado: </strong> {formData.estado}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MetasAhorro;
