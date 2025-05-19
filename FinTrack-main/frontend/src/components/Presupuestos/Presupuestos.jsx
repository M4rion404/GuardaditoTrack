import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Presupuestos.css";
import PresupuestoResumen from "./PresupuestoResumen";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf, FaEye } from "react-icons/fa";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { FaTags } from "react-icons/fa";

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
    <FaTimes style={{ color: "#757575" }} />
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
  meta_ahorro: "",
  monto_inicial: "",
  dinero_ahorrado: "",
  dinero_gastado: "",
  categoria_asociada: "",
  divisa_asociada: "",
};

const limpiarDatos = (data) => ({
  ...data,
  categoria_asociada: data.categoria_asociada || null,
  divisa_asociada: data.divisa_asociada || null,
});

const validarCampos = (data) => {
  const meta_ahorro = Number(data.meta_ahorro);
  const monto_inicial = Number(data.monto_inicial);
  const dinero_ahorrado = Number(data.dinero_ahorrado);
  const dinero_gastado = Number(data.dinero_gastado);

  if (isNaN(meta_ahorro) || meta_ahorro < 0)
    return "La meta de ahorro debe ser un número mayor o igual a 0.";
  if (data.monto_inicial !== "" && (isNaN(monto_inicial) || monto_inicial < 0))
    return "El monto inicial debe ser un número mayor o igual a 0.";
  if (
    data.dinero_ahorrado !== "" &&
    (isNaN(dinero_ahorrado) || dinero_ahorrado < 0)
  )
    return "El dinero ahorrado debe ser un número mayor o igual a 0.";
  if (
    data.dinero_gastado !== "" &&
    (isNaN(dinero_gastado) || dinero_gastado < 0)
  )
    return "El dinero gastado debe ser un número mayor o igual a 0.";
  if (monto_inicial && dinero_ahorrado + dinero_gastado > monto_inicial)
    return "La suma de dinero ahorrado y gastado no puede ser mayor que el monto inicial.";
  return null;
};

// Formulario reutilizable para crear/editar
function PresupuestoForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  error,
  categorias,
  divisas,
}) {
  return (
    <form onSubmit={onSubmit} className="presupuestos-form">
      <div className="form-group">
        <label htmlFor="titulo">Titulo del Presupuesto:</label>
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
        <label htmlFor="meta_ahorro">Meta de Ahorro:</label>
        <input
          type="number"
          id="meta_ahorro"
          name="meta_ahorro"
          value={formData.meta_ahorro}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, meta_ahorro: e.target.value }))
          }
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="monto_inicial">Monto Inicial:</label>
        <input
          type="number"
          id="monto_inicial"
          name="monto_inicial"
          value={formData.monto_inicial}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, monto_inicial: e.target.value }))
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="dinero_ahorrado">Dinero Ahorrado:</label>
        <input
          type="number"
          id="dinero_ahorrado"
          name="dinero_ahorrado"
          value={formData.dinero_ahorrado}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              dinero_ahorrado: e.target.value,
            }))
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="dinero_gastado">Dinero Gastado:</label>
        <input
          type="number"
          id="dinero_gastado"
          name="dinero_gastado"
          value={formData.dinero_gastado}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, dinero_gastado: e.target.value }))
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="categoria_asociada">Categoría:</label>
        <select
          id="categoria_asociada"
          name="categoria_asociada"
          value={formData.categoria_asociada}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              categoria_asociada: e.target.value || "",
            }))
          }
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.Titulo}
            </option>
          ))}
        </select>
      </div>
      <select
        id="divisa_asociada"
        name="divisa_asociada"
        value={formData.divisa_asociada}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            divisa_asociada: e.target.value || "",
          }))
        }
      >
        <option value="">Seleccionar divisa</option>
        {divisas.map((divisa) => (
          <option key={divisa._id} value={divisa._id}>
            {divisa.divisa} - {divisa.nombre}
          </option>
        ))}
      </select>
      <div className="btn-submit-container">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

const Presupuestos = () => {
  // Estados principales
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("crear"); // crear | editar | ver
  const [formData, setFormData] = useState(initialForm);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [divisas, setDivisas] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroDivisa, setFiltroDivisa] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  // Constantes
  const ITEMS_PER_PAGE = 5;

  // Fetch presupuestos
  const fetchPresupuestos = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
      if (!token) throw new Error("No token disponible, inicia sesión.");
      const { data } = await axios.get(
        `http://localhost:3000/api/presupuestos/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPresupuestos(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categorías
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
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchDivisas = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/divisas/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDivisas(res.data); // aquí tú decides si usar setTipoDivisa, setDivisasUsuario, etc.
    } catch (error) {
      console.error("Error al cargar divisas:", error);
    }
  };

  fetchDivisas();
}, []);

  // Fetch presupuestos inicial
  useEffect(() => {
    fetchPresupuestos();
    // eslint-disable-next-line
  }, []);

  // Helpers
  const obtenerNombreCategoria = (id) => {
    const categoria = categorias.find((cat) => cat._id === id);
    return categoria?.Titulo || "Sin categoría";
  };

  const obtenerNombreDivisa = (id) => {
    const divisa = divisas.find((d) => d._id === id);
    return divisa?.divisa || "Sin divisa";
  };

  // Modal handlers
  const abrirModalCrear = () => {
    setFormData(initialForm);
    setPresupuestoSeleccionado(null);
    setModalMode("crear");
    setModalOpen(true);
  };

  const abrirModalEditar = () => {
    if (!presupuestoSeleccionado) return;
    setFormData({
      titulo: presupuestoSeleccionado.titulo || "",
      descripcion: presupuestoSeleccionado.descripcion || "",
      meta_ahorro: presupuestoSeleccionado.meta_ahorro || "",
      monto_inicial: presupuestoSeleccionado.monto_inicial || "",
      dinero_ahorrado: presupuestoSeleccionado.dinero_ahorrado || "",
      dinero_gastado: presupuestoSeleccionado.dinero_gastado || "",
      categoria_asociada: presupuestoSeleccionado.categoria_asociada || "",
      divisa_asociada: presupuestoSeleccionado.divisa_asociada || "",
    });
    setModalMode("editar");
    setModalOpen(true);
  };

  const abrirModalVer = (presupuesto) => {
    setPresupuestoSeleccionado(presupuesto);
    setFormData({
      titulo: presupuesto.titulo || "",
      descripcion: presupuesto.descripcion || "",
      meta_ahorro: presupuesto.meta_ahorro || "",
      monto_inicial: presupuesto.monto_inicial || "",
      dinero_ahorrado: presupuesto.dinero_ahorrado || "",
      dinero_gastado: presupuesto.dinero_gastado || "",
      categoria_asociada: presupuesto.categoria_asociada || "",
      divisa_asociada: presupuesto.divisa_asociada || "",
    });
    setModalMode("ver");
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setFormData(initialForm);
    setPresupuestoSeleccionado(null);
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
        `http://localhost:3000/api/presupuestos/${userId}`,
        cleanData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await Swal.fire({
        icon: "success",
        title: "¡Presupuesto creado!",
        text: "Los datos se guardaron correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchPresupuestos();
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

    const validacion = validarCampos(formData);
    if (validacion) {
      setError(validacion);
      return;
    }
    const userId = localStorage.getItem("userId");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado. Inicie sesión.");
      const dataLimpia = limpiarDatos(formData);
      await axios.put(
        `http://localhost:3000/api/presupuestos/${userId}/${presupuestoSeleccionado._id}`,
        dataLimpia,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await Swal.fire({
        icon: "success",
        title: "¡Presupuesto actualizado!",
        text: "Los cambios se guardaron correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchPresupuestos();
      cerrarModal();
    } catch (err) {
      setError("Error al actualizar el presupuesto");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!presupuestoSeleccionado) return;
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
          `http://localhost:3000/api/presupuestos/${userId}/${presupuestoSeleccionado._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await fetchPresupuestos();
        cerrarModal();
      } catch (err) {
        setError("Error al eliminar el presupuesto");
      }
    }
    setLoading(false);
  };

// Filtrar categorias y divisas usados en presupuestos
  const categoriasUsadas = categorias.filter((c) =>
    presupuestos.some((p) => p.categoria_asociada === c._id)
  );

  const divisasUsadas = divisas.filter((d) =>
    presupuestos.some((p) => p.divisa_asociada === d._id)
  );


  const presupuestosFiltrados = presupuestos.filter((p) => {
  const coincideCategoria = filtroCategoria
    ? p.categoria_asociada === filtroCategoria
    : true;

  const coincideDivisa = filtroDivisa
    ? p.divisa_asociada === filtroDivisa
    : true;

  const coincideBusqueda = busqueda
    ? p.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
    : true;

  return coincideCategoria && coincideDivisa && coincideBusqueda;
});

  // Paginación
  const totalPaginas = Math.ceil(
    presupuestosFiltrados.length / ITEMS_PER_PAGE
  );

  const presupuestosPaginados = presupuestosFiltrados.slice(
    (paginaActual - 1) * ITEMS_PER_PAGE,
    paginaActual * ITEMS_PER_PAGE
  );

  // Ir a página específica
  const irAPagina = (numPagina) => {
    if (numPagina < 1 || numPagina > totalPaginas) return;
    setPaginaActual(numPagina);
  };

  // Gráfico
  const dataGraph = {
    labels: ["Ahorrado", "Faltante"],
    datasets: [
      {
        label: "Estado del ahorro",
        data: [
          Number(presupuestoSeleccionado?.dinero_ahorrado || 0),
          Math.max(
            0,
            Number(presupuestoSeleccionado?.meta_ahorro || 0) -
              Number(presupuestoSeleccionado?.dinero_ahorrado || 0)
          ),
        ],
        backgroundColor: ["#4caf50", "#f44336"],
        borderWidth: 1,
      },
    ],
  };
  const exportarPDF = () => {
    const doc = new jsPDF();

    const columnas = [
      "Título",
      "Descripción",
      "Meta Ahorro",
      "Monto Inicial",
      "Dinero Ahorrado",
      "Dinero Gastado",
      "Categoría",
      "Divisa",
      "Fecha",
    ];

    // filas: cada presupuesto es un array con sus datos
    const filas = presupuestosFiltrados.map((p) => [
      p.titulo || "",
      p.descripcion || "",
      `$${Number(p.meta_ahorro || 0).toFixed(2)}`,
      `$${Number(p.monto_inicial || 0).toFixed(2)}`,
      `$${Number(p.dinero_ahorrado || 0).toFixed(2)}`,
      `$${Number(p.dinero_gastado || 0).toFixed(2)}`,
      obtenerNombreCategoria(p.categoria_asociada) || "",
      obtenerNombreDivisa(p.divisa_asociada) || "",
      p.fecha_creacion ? new Date(p.fecha_creacion).toLocaleDateString() : "",
    ]);

    doc.text("Listado de Presupuestos", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [columnas],
      body: filas,
    });

    doc.save("presupuestos.pdf");
  };

  return (
    <div className="presupuestos-tabla-container">
      <div>
        <div className="brine-header">
          <button onClick={() => (window.location.href = "/home")}>
            &larr; Regresar
          </button>
          <h1>
            <FaTags style={{ marginRight: "10px", marginTop: "80px" }} />
            Gestión de Presupuestos Financieros
          </h1>
          <p>
            Administra tus presupuestos para un mejor control de tus finanzas
            personales
          </p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="brine-intro">
          <h2>¿Qué puedes hacer aquí?</h2>
          <p>
            Esta sección te permite crear nuevos presupuestos, organizar tus
            finanzas y visualizar rápidamente tus registros.
          </p>
          <ul>
            <li>Crear un nuevo presupuesto personalizado.</li>
            <li>Gestionar los presupuestos que ya creaste.</li>
          </ul>
        </div>
      </div>

      <PresupuestoResumen presupuestos={presupuestos} />

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
          onClick={() => abrirModalVer(presupuestoSeleccionado)}
          disabled={!presupuestoSeleccionado}
          title="Detalles"
        >
          <IconVer /> Detalles
        </button>
        <button
          className="btn-icon-Editar"
          onClick={abrirModalEditar}
          disabled={!presupuestoSeleccionado}
          title="Editar"
        >
          <IconEditar /> Editar
        </button>
        <button
          className="btn-icon-Eliminar"
          onClick={handleDelete}
          disabled={!presupuestoSeleccionado}
          title="Eliminar"
        >
          <IconEliminar /> Eliminar
        </button>
        <button
          className="btn-icon-Refrescar"
          onClick={fetchPresupuestos}
          title="Refrescar"
        >
          <IconRefrescar /> Refrescar
        </button>
        <button
          className="btn-icon-PDF"
          onClick={exportarPDF} // Cambié fetchPresupuestos por exportarPDF
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
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categoriasUsadas.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.Titulo}
              </option>
            ))}
          </select>
          <select
            value={filtroDivisa}
            onChange={(e) => setFiltroDivisa(e.target.value)}
          >
            <option value="">Todas las divisas</option>
            {divisasUsadas.map((div) => (
              <option key={div._id} value={div._id}>
                {div.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="presupuestos-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Meta Ahorro</th>
            <th>Monto Inicial</th>
            <th>Ahorrado</th>
            <th>Gastado</th>
            <th>Categoría</th>
            <th>Divisa</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {presupuestosPaginados.map((presupuesto) => {
            const ahorroBueno =
              Number(presupuesto.dinero_ahorrado || 0) >=
              Number(presupuesto.meta_ahorro || 0);
            const gastoAlto =
              Number(presupuesto.dinero_gastado || 0) >
              Number(presupuesto.meta_ahorro || 0) * 0.25;
            return (
              <tr
                key={presupuesto._id}
                onClick={() => setPresupuestoSeleccionado(presupuesto)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    presupuestoSeleccionado?._id === presupuesto._id
                      ? "#e0f7fa"
                      : "transparent",
                }}
              >
                <td>{presupuesto.titulo}</td>
                <td>{presupuesto.descripcion}</td>
                <td>${Number(presupuesto.meta_ahorro || 0).toFixed(2)}</td>
                <td>${Number(presupuesto.monto_inicial || 0).toFixed(2)}</td>
                <td className={ahorroBueno ? "positivo" : "negativo"}>
                  ${Number(presupuesto.dinero_ahorrado || 0).toFixed(2)}
                </td>
                <td className={gastoAlto ? "negativo" : "positivo"}>
                  ${Number(presupuesto.dinero_gastado || 0).toFixed(2)}
                </td>
                <td>
                  {obtenerNombreCategoria(presupuesto.categoria_asociada)}
                </td>
                <td>{obtenerNombreDivisa(presupuesto.divisa_asociada)}</td>
                <td>
                  {presupuesto.fecha_creacion
                    ? new Date(presupuesto.fecha_creacion).toLocaleDateString()
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
                <h2>Crear Presupuesto</h2>
                <PresupuestoForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  loading={loading}
                  error={error}
                  categorias={categorias}
                  divisas={divisas}
                />
              </>
            )}
            {modalMode === "editar" && (
              <>
                <h2>Editar Presupuesto</h2>
                <PresupuestoForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleUpdate}
                  loading={loading}
                  error={error}
                  categorias={categorias}
                  divisas={divisas}
                />
              </>
            )}
            {modalMode === "ver" && (
              <>
                <h2>Detalles del Presupuesto</h2>
                <div className="detalle-presupuesto">
                  <p>
                    <strong>Título:</strong> {formData.titulo}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {formData.descripcion}
                  </p>
                  <p>
                    <strong>Meta de Ahorro:</strong> $
                    {Number(formData.meta_ahorro).toFixed(2)}
                  </p>
                  <p>
                    <strong>Monto Inicial:</strong> $
                    {Number(formData.monto_inicial).toFixed(2)}
                  </p>
                  <p>
                    <strong>Dinero Ahorrado:</strong> $
                    {Number(formData.dinero_ahorrado).toFixed(2)}
                  </p>
                  <p>
                    <strong>Dinero Gastado:</strong> $
                    {Number(formData.dinero_gastado).toFixed(2)}
                  </p>
                  <p>
                    <strong>Categoría:</strong>{" "}
                    {presupuestoSeleccionado?.categoria_asociada
                      ? obtenerNombreCategoria(
                          presupuestoSeleccionado.categoria_asociada
                        )
                      : "No asignada"}
                  </p>
                  <p>
                    <strong>Divisa:</strong>{" "}
                    {presupuestoSeleccionado?.divisa_asociada
                      ? obtenerNombreDivisa(
                          presupuestoSeleccionado.divisa_asociada
                        )
                      : "No asignada"}
                  </p>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {presupuestoSeleccionado && (
                      <div className="grafico-ahorro">
                        <h3>Estado del Ahorro</h3>
                        <Doughnut data={dataGraph} />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Presupuestos;
