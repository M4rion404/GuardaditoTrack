import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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

// Formulario reutilizable para crear/editar
function TransaccionForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  error,
  presupuestos,
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
          {presupuestos.map((cat) => (
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

const Transacciones = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    accion: "Retiro",
    metodo_pago: "Efectivo",
    monto: "",
    estado: "En proceso",
    divisa_asociada: "",
    transaccion_asociado: "",
  });

  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState(null);
  const [divisas, setDivisas] = useState([]);
  const [categorias, setCategorias] = useState([]); //no lo usare aqui
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("crear"); // crear | editar | ver
  const [filtroPresupuesto, setFiltroPresupuesto] = useState("");
  const [filtroDivisa, setFiltroDivisa] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");

  // Constantes
  const ITEMS_PER_PAGE = 5;

  const fetchTransacciones = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(
        `http://localhost:3000/api/transacciones/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al obtener las transacciones");
      }

      const data = await response.json();
      setTransacciones(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDivisas = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(`http://localhost:3000/api/divisas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDivisas(response.data);
    } catch (err) {
      console.error("Error al obtener divisas:", err);
    }
  };

  const fetchtransacciones = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/transacciones/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransacciones(response.data);
    } catch (err) {
      console.error("Error al obtener transacciones:", err);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchTransacciones();
      fetchDivisas();
      fetchtransacciones();
    } else {
      console.error("No hay userId en localStorage.");
      setError("Debes iniciar sesión.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem("userId");
    console.log("UserId obtenido: ", userId);

    if (!userId) {
      console.error("Error: No se encontro el ID del usuario");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:3000/api/transacciones/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Transaccion Registrada:", response.data);
      //setTransacciones((p) => [...p, response.data]);
      fetchTransacciones();
      setFormData({
        titulo: "",
        descripcion: "",
        accion: "Retiro",
        metodo_pago: "Efectivo",
        monto: "",
        estado: "En proceso",
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updateData) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.put(
        `http://localhost:3000/api/transacciones/${userId}/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Transaccion actualizada:", response.data);
      /* setTransacciones((prev) =>
        prev.map((p) => (p._id === id ? response.data : p))
      ); */
      fetchTransacciones();

      setFormData({
        titulo: "",
        descripcion: "",
        accion: "Retiro",
        metodo_pago: "Efectivo",
        monto: "",
        estado: "En proceso",
      });

      setTransaccionSeleccionada(null);
      setError(null);
    } catch (err) {
      console.error("Error actualizando transaccion: ", err);
      console.error("Respuesta del servidor", err.response?.data);
      setError("Error al actualizar la transaccion");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      console.log("Eliminando transaccion con ID:", id);
      const response = await axios.delete(
        `http://localhost:3000/api/transacciones/${userId}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("transaccion eliminado:", response.data);
      /* setTransacciones((prev) => prev.filter((p) => p._id !== id)); */
      fetchTransacciones();

      if (transaccionSeleccionada?._id === id) {
        setFormData({
          titulo: "",
          descripcion: "",
          accion: "Retiro",
          metodo_pago: "Efectivo",
          monto: "",
          estado: "En proceso",
        });
      }

      setTransaccionSeleccionada(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (transaccion) => {
    setFormData({
      titulo: transaccion.titulo,
      descripcion: transaccion.descripcion,
      accion: transaccion.accion,
      metodo_pago: transaccion.metodo_pago,
      monto: transaccion.monto,
      estado: transaccion.estado,
    });
    setTransaccionSeleccionada(transaccion);
  };

  const handleRefresh = () => {
    fetchTransacciones();
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
      meta_ahorro: transaccionSeleccionada.meta_ahorro || "",
      monto_inicial: transaccionSeleccionada.monto_inicial || "",
      dinero_ahorrado: transaccionSeleccionada.dinero_ahorrado || "",
      dinero_gastado: transaccionSeleccionada.dinero_gastado || "",
      categoria_asociada: transaccionSeleccionada.categoria_asociada || "",
      divisa_asociada: transaccionSeleccionada.divisa_asociada || "",
    });
    setModalMode("editar");
    setModalOpen(true);
  };

  const abrirModalVer = (transaccion) => {
    setTransaccionSeleccionada(transaccion);
    setFormData({
      titulo: transaccion.titulo || "",
      descripcion: transaccion.descripcion || "",
      meta_ahorro: transaccion.meta_ahorro || "",
      monto_inicial: transaccion.monto_inicial || "",
      dinero_ahorrado: transaccion.dinero_ahorrado || "",
      dinero_gastado: transaccion.dinero_gastado || "",
      categoria_asociada: transaccion.categoria_asociada || "",
      divisa_asociada: transaccion.divisa_asociada || "",
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

  // Helpers
  const obtenerNombreCategoria = (id) => {
    const categoria = categorias.find((cat) => cat._id === id);
    return categoria?.Titulo || "Sin categoría";
  };

  const obtenerNombreDivisa = (id) => {
    const divisa = divisas.find((d) => d._id === id);
    return divisa?.divisa || "Sin divisa";
  };

  // Filtros y paginación
  const transaccionesFiltrados = transacciones.filter((p) => {
    const coincideBusqueda =
      p.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroPresupuesto
      ? p.categoria_asociada === filtroPresupuesto
      : true;
    const coincideDivisa = filtroDivisa
      ? p.divisa_asociada === filtroDivisa
      : true;
    return coincideBusqueda && coincideCategoria && coincideDivisa;
  });

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
      "Meta Ahorro",
      "Monto Inicial",
      "Dinero Ahorrado",
      "Dinero Gastado",
      "Categoría",
      "Divisa",
      "Fecha",
    ];

    // filas: cada transaccion es un array con sus datos
    const filas = transaccionesFiltrados.map((p) => [
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
          <button onClick={() => (window.location.href = "/home")}>
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
          <h2>¿Qué puedes hacer aquí?</h2>
          <p>
            Esta sección te permite crear nuevas transacciones, organizar tus
            finanzas y visualizar rápidamente tus registros.
          </p>
          <ul>
            <li>Crear una nueva transaccion personalizada.</li>
            <li>Gestionar las transacciones que ya creaste.</li>
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
          onClick={fetchtransacciones}
          title="Refrescar"
        >
          <IconRefrescar /> Refrescar
        </button>
        <button
          className="btn-icon-PDF"
          onClick={exportarPDF} // Cambié fetchtransacciones por exportarPDF
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
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
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
            {divisas.map((div) => (
              <option key={div._id} value={div._id}>
                {div.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="transacciones-table">
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
          {transaccionesPaginadas.map((transaccion) => {
            const ahorroBueno =
              Number(transaccion.dinero_ahorrado || 0) >=
              Number(transaccion.meta_ahorro || 0);
            const gastoAlto =
              Number(transaccion.dinero_gastado || 0) >
              Number(transaccion.meta_ahorro || 0) * 0.25;
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
                <td>{transaccion.descripcion}</td>
                <td>${Number(transaccion.meta_ahorro || 0).toFixed(2)}</td>
                <td>${Number(transaccion.monto_inicial || 0).toFixed(2)}</td>
                <td className={ahorroBueno ? "positivo" : "negativo"}>
                  ${Number(transaccion.dinero_ahorrado || 0).toFixed(2)}
                </td>
                <td className={gastoAlto ? "negativo" : "positivo"}>
                  ${Number(transaccion.dinero_gastado || 0).toFixed(2)}
                </td>
                <td>
                  {obtenerNombreCategoria(transaccion.categoria_asociada)}
                </td>
                <td>{obtenerNombreDivisa(transaccion.divisa_asociada)}</td>
                <td>
                  {transaccion.fecha_creacion
                    ? new Date(transaccion.fecha_creacion).toLocaleDateString()
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
                      <TransaccionForm
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
                      <TransaccionForm
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
                          {transaccionSeleccionada?.categoria_asociada
                            ? obtenerNombreCategoria(
                                transaccionSeleccionada.categoria_asociada
                              )
                            : "No asignada"}
                        </p>
                        <p>
                          <strong>Divisa:</strong>{" "}
                          {transaccionSeleccionada?.divisa_asociada
                            ? obtenerNombreDivisa(
                                transaccionSeleccionada.divisa_asociada
                              )
                            : "No asignada"}
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

export default Transacciones;
