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
import "./Transacciones.css";

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
  titulo: "",
  descripcion: "",
  accion: "",
  metodo_pago: "",
  monto: "",
  estado: "",
  divisa_asociada: "",
  presupuesto_asociado: "",
};

const limpiarDatos = (data) => ({
  ...data,
  divisa_asociada: data.divisa_asociada || null,
  presupuesto_asociado: data.presupuesto_asociado || null,
});

const validarCampos = (data) => {
  // Validación de campos requeridos
  if (!data.titulo || !data.accion || !data.metodo_pago || !data.monto || !data.estado) {
    return "Por favor, complete todos los campos obligatorios.";
  }
  // Validar acción
  if (!["Ingreso", "Retiro"].includes(data.accion)) {
    return "La acción debe ser 'Ingreso' o 'Retiro'.";
  }
  // Validar método de pago
  if (
    ![
      "Efectivo",
      "Tarjeta de crédito",
      "Tarjeta de Debito",
      "Pago Móvil",
      "PayPal",
      "Criptomonedas",
      "Pago con código QR",
      "Transferencia",
    ].includes(data.metodo_pago)
  ) {
    return "Seleccione un método de pago válido.";
  }
  // Validar estado
  if (!["En proceso", "Completado", "Cancelado"].includes(data.estado)) {
    return "Seleccione un estado válido.";
  }
  // Validar monto
  if (isNaN(Number(data.monto)) || Number(data.monto) < 0) {
    return "El monto debe ser un número positivo.";
  }
  return null;
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
          <option value="Tarjeta de crédito">Tarjeta de Crédito</option>
          <option value="Tarjeta de Debito">Tarjeta de Débito</option>
          <option value="Pago Móvil">Pago Móvil</option>
          <option value="PayPal">PayPal</option>
          <option value="Criptomonedas">Criptomonedas</option>
          <option value="Pago con código QR">Pago con código QR</option>
          <option value="Transferencia">Transferencia</option>
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
      <div className="form-group">
        <label htmlFor="estado">Estado:</label>
        <select
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, estado: e.target.value }))
          }
          required
        >
          <option value="">Seleccionar estado</option>
          <option value="En proceso">En Proceso</option>
          <option value="Completado">Completado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="divisa_asociada">Divisa:</label>
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
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState(null);
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
      if (!response.ok) throw new Error("Error al obtener las transacciones");

      const data = await response.json();
      setTransacciones(data);
      setTransaccionSeleccionada(null); // <- Limpia la selección
    } catch (err) {
      setError(err.message);
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
      } catch (error) {
        // No setError aquí para no mostrar error si no hay presupuestos
      }
    };
    fetchPresupuestos();
  }, []);

  // Fetch divisas
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchDivisas = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/divisas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDivisas(res.data);
      } catch (error) {
        // No setError aquí para no mostrar error si no hay divisas
      }
    };
    fetchDivisas();
  }, []);

  useEffect(() => {
    fetchTransacciones();
    // eslint-disable-next-line
  }, []);

  // Helpers
  const obtenerNombrePresupuesto = (id) => {
  const presupuesto = presupuestos.find((p) => p._id === id);
  return presupuesto?.titulo || "Sin Presupuesto";
};



const obtenerNombreDivisa = (id) => {
    const divisa = divisas.find((d) => d._id === id);
    return divisa?.divisa || "Sin divisa";
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
      estado: transaccionSeleccionada.estado || "",
      divisa_asociada: transaccionSeleccionada.divisa_asociada || "",
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
    estado: transaccion.estado || "",
    divisa_asociada:
      transaccion.divisa_asociada?._id || transaccion.divisa_asociada || "",
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
    const userId = localStorage.getItem("userId");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado. Inicie sesión.");
      const cleanData = limpiarDatos(formData);
      await axios.post(
        `http://localhost:3000/api/transacciones/${userId}`,
        cleanData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await Swal.fire({
        icon: "success",
        title: "Transaccion creada!",
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
    console.error("No hay transacción seleccionada");
    setError("Debe seleccionar una transacción para actualizar");
    return;
  }

  console.log("Transacción seleccionada:", transaccionSeleccionada);

  const validacion = validarCampos(formData);
  if (validacion) {
    setError(validacion);
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) throw new Error("Sesión inválida. Por favor, inicia sesión.");

    console.log("ID transacción seleccionada:", transaccionSeleccionada._id);

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
    console.error(err);
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

  // Filtros y paginación
  const transaccionesFiltrados = transacciones.filter((t) => {
    const coincideBusqueda =
      t.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    const coincidePresupuesto = filtroPresupuesto
      ? t.presupuesto_asociado === filtroPresupuesto
      : true;
    const coincideDivisa = filtroDivisa
      ? t.divisa_asociada === filtroDivisa
      : true;
    return coincideBusqueda && coincidePresupuesto && coincideDivisa;
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
      "Accion",
      "Metodo de Pago",
      "Monto",
      "Estado",
      "Divisa Asociada",
      "Presupuesto Asociado",
      "Fecha",
    ];
    const filas = transaccionesFiltrados.map((t) => [
      t.titulo || "",
      t.descripcion || "",
      t.accion || "",
      t.metodo_pago || "",
      `$${Number(t.monto || 0).toFixed(2)}`,
      t.estado || "",
      obtenerNombreDivisa(t.divisa_asociada) || "",
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
            {presupuestos.map((pres) => (
              <option key={pres._id} value={pres._id}>
                {pres.titulo}
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
            <th>Accion</th>
            <th>Metodo de Pago</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Divisa</th>
            <th>Presupuesto</th>
            <th>Fecha</th>
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
      <td>{transaccion.descripcion}</td>
      <td>{transaccion.accion}</td>
      <td>{transaccion.metodo_pago}</td>
      <td>${Number(transaccion.monto || 0).toFixed(2)}</td>
      <td>{transaccion.estado}</td>
      <td>{obtenerNombreDivisa(transaccion.divisa_asociada) ?? "-"}</td>
      <td>{obtenerNombrePresupuesto(transaccion.presupuesto_asociado) ?? "-"}</td>
      <td>
        {transaccion.fecha
          ? new Date(transaccion.fecha).toLocaleDateString()
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
                <h2>Crear Transaccion</h2>
                <TransaccionForm
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
                <h2>Editar Transaccion</h2>
                <TransaccionForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleUpdate}
                  loading={loading}
                  error={error}
                  presupuestos={presupuestos}
                  divisas={divisas}
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
                    <strong>Estado: </strong> {formData.estado}
                  </p>
                  <p>
                    <strong>Divisa:</strong>{" "}
                    {transaccionSeleccionada?.divisa_asociada
                      ? obtenerNombreDivisa(
                          transaccionSeleccionada.divisa_asociada
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
