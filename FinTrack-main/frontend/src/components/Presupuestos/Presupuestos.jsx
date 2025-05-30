import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaEdit, FaTrash, FaSyncAlt, FaSearch, FaTimes, FaTags, FaFilePdf, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import PresupuestoResumen from "./PresupuestoResumen";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineController,
  LineElement,
  PointElement,
} from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from "react-chartjs-2";
import "../Estilos/modalesStyles.css"

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineController,
  LineElement,
  PointElement,
  ChartDataLabels
);

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
  limite: 0,
  dinero_disponible: 0,
  periodo: "",
  categorias: [], // [{ categoria: <id>, limite: "" }]
};

const limpiarDatos = (data) => ({
  ...data,
  categoria_asociada: data.categoria_asociada || null,
});

const validarCampos = (data) => {
  const limite = Number(data.limite);
  const dinero_disponible = Number(data.dinero_disponible);

  if (isNaN(limite) || limite < 0)
    return "El limite de presupuesto debe ser un número mayor o igual a 0.";


  if (data.categorias && data.categorias.length > 0) {
    // Filtrar solo categorías que tienen algún dato (no completamente vacías)
    const categoriasConDatos = data.categorias.filter(cat =>
      cat.categoria?._id || Number(cat.limite) > 0
    );

    if (categoriasConDatos.length > 0) {
      // Verificar que todas las categorías con datos estén completas
      const categoriasSinSeleccionar = categoriasConDatos.some(cat => !cat.categoria || !cat.categoria._id);
      if (categoriasSinSeleccionar) {
        return "Todas las categorías deben estar seleccionadas. Elimina las filas vacías o selecciona una categoría.";
      }

      const idsCategoriasSeleccionadas = categoriasConDatos.map(cat => cat.categoria._id);
      const categoriasUnicas = new Set(idsCategoriasSeleccionadas);
      if (idsCategoriasSeleccionadas.length !== categoriasUnicas.size) {
        return "No puedes seleccionar la misma categoría más de una vez.";
      }

      const limitesInvalidos = categoriasConDatos.some(cat => {
        const limite = Number(cat.limite);
        return isNaN(limite) || limite <= 0;
      });
      if (limitesInvalidos) {
        return "Todos los límites de categorías deben ser números válidos mayores que 0.";
      }
    }
  }

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
  esFormularioValido
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
        <label htmlFor="limite">Limite del presupuesto:</label>
        <input
          type="number"
          id="limite"
          name="limite"
          value={formData.limite}
          onChange={(e) => {
            const limiteValue = e.target.value;
            setFormData((prev) => ({
              ...prev,
              limite: limiteValue,
              dinero_disponible: limiteValue, // Actualizar dinero_disponible automáticamente
            }));
          }}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="periodo">Periodo:</label>
        <select
          id="periodo"
          name="periodo"
          value={formData.periodo}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, periodo: e.target.value }))
          }
          required
        >
          <option value="">Seleccionar periodo</option>
          <option value="Mensual">Mensual</option>
          <option value="Semanal">Semanal</option>
          <option value="Anual">Anual</option>
          <option value="Quincenal">Quincenal</option>
        </select>
      </div>

      <div className="form-group">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <label>Categorías y límites:</label>
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                categorias: [...prev.categorias, { categoria: null, limite: 0 }]
              }));
            }}
            style={{
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            + Agregar Categoría
          </button>
        </div>

        {formData.categorias.map((cat, index) => {
          // Solo marcar como duplicada si la categoría está seleccionada
          const esDuplicada = cat.categoria?._id && formData.categorias.some((otraCat, otroIndex) =>
            otroIndex !== index &&
            otraCat.categoria?._id &&
            cat.categoria._id === otraCat.categoria._id
          );

          // Solo mostrar bordes rojos si hay un problema real, no en categorías vacías nuevas
          const tieneProblemas = cat.categoria?._id && (
            esDuplicada ||
            (cat.limite !== '' && (isNaN(Number(cat.limite)) || Number(cat.limite) <= 0))
          );

          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "1rem",
                padding: "1rem",
                border: tieneProblemas ? "2px solid #f44336" : "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: tieneProblemas ? "#ffebee" : "transparent"
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <select
                  value={cat.categoria?._id || ""}
                  onChange={(e) => {
                    const nuevaCategoria = categorias.find(
                      (c) => c._id === e.target.value
                    );
                    const nuevasCategorias = [...formData.categorias];
                    nuevasCategorias[index].categoria = nuevaCategoria;
                    setFormData({ ...formData, categorias: nuevasCategorias });
                  }}
                  style={{
                    flex: 2,
                    borderColor: esDuplicada ? "#f44336" : "#ddd",
                    borderWidth: esDuplicada ? "2px" : "1px"
                  }}
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria._id} value={categoria._id}>
                      {categoria.titulo}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Límite"
                  min={0}
                  step="0.01"
                  value={cat.limite}
                  onChange={(e) => {
                    const nuevasCategorias = [...formData.categorias];
                    nuevasCategorias[index].limite = Number(e.target.value);
                    setFormData({ ...formData, categorias: nuevasCategorias });
                  }}
                  style={{
                    flex: 1,
                    borderColor: (cat.limite !== '' && (isNaN(Number(cat.limite)) || Number(cat.limite) <= 0)) ? "#f44336" : "#ddd"
                  }}
                />

                <button
                  type="button"
                  onClick={() => {
                    const nuevasCategorias = formData.categorias.filter(
                      (_, i) => i !== index
                    );
                    setFormData({ ...formData, categorias: nuevasCategorias });
                  }}
                  style={{
                    backgroundColor: "#f44336",
                    border: "none",
                    color: "white",
                    padding: "0.4rem 0.6rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                {/* Solo mostrar errores si la categoría tiene algún dato */}
                {cat.categoria?._id && esDuplicada && (
                  <span style={{ color: "#f44336", fontSize: "0.8rem", display: "block" }}>
                    Esta categoría ya está seleccionada en otra fila.
                  </span>
                )}

                {cat.categoria?._id && cat.limite !== '' && (isNaN(Number(cat.limite)) || Number(cat.limite) <= 0) && (
                  <span style={{ color: "#f44336", fontSize: "0.8rem", display: "block" }}>
                    El límite debe ser un número mayor que 0.
                  </span>
                )}
              </div>
            </div>
          );
        })}

      </div>


      <div className="btn-submit-container">
        <button
          type="submit"
          className="btn-submit"
          disabled={loading || !esFormularioValido()}
          style={{
            opacity: (!esFormularioValido() || loading) ? 0.6 : 1,
            cursor: (!esFormularioValido() || loading) ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>

        {/* Mensaje de ayuda */}
        {!esFormularioValido() && formData.categorias.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p
              style={{
                color: "#f44336",
                fontSize: "0.9rem",
                marginTop: "0.5rem",
                textAlign: "center",
              }}
            >
              Completa todos los campos de categorías antes de guardar
            </p>
          </div>
        )}

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
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [periodos, setPeriodos] = useState([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [isOpenBudget, setIsOpenBudget] = useState(false);
  const [isOpenGoals, setIsOpenGoals] = useState(false);
  const budgetRef = useRef(null);
  const goalsRef = useRef(null);

  // Constantes
  const ITEMS_PER_PAGE = 5;

  // Fetch presupuestos

  const [categoriasDePresupuestos, setCategoriasDePresupuestos] = useState([]);


  const esFormularioValido = () => {
    // Validaciones básicas del formulario (título, límite, etc.)
    if (!formData.titulo || !formData.limite || !formData.periodo) {
      return false;
    }

    // Si no hay categorías, el formulario es válido
    if (!formData.categorias || formData.categorias.length === 0) {
      return true;
    }

    // Solo validar categorías que tienen al menos algo seleccionado
    // (no validar las que están completamente vacías)
    const categoriasConDatos = formData.categorias.filter(cat =>
      cat.categoria?._id || cat.limite > 0
    );

    if (categoriasConDatos.length === 0) {
      return true; // Si no hay categorías con datos, está bien
    }

    // Validar solo las categorías que tienen algún dato
    const todasSeleccionadas = categoriasConDatos.every(cat => cat.categoria?._id);

    const limitesValidos = categoriasConDatos.every(cat => {
      const limite = Number(cat.limite);
      return !isNaN(limite) && limite > 0;
    });

    // Verificar no duplicadas solo en las categorías con datos
    const idsCategoriasSeleccionadas = categoriasConDatos
      .map(cat => cat.categoria?._id)
      .filter(Boolean);
    const categoriasUnicas = new Set(idsCategoriasSeleccionadas);
    const noDuplicadas = idsCategoriasSeleccionadas.length === categoriasUnicas.size;

    return todasSeleccionadas && limitesValidos && noDuplicadas;
  };

  useEffect(() => {
    fetchPresupuestosAnidados();
  }, []);

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

  const fetchPresupuestosAnidados = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
      const res = await axios.get(
        `http://localhost:3000/api/presupuestos/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Categorias obtenidas: ", res.data);
      const data = res.data;
      setPresupuestos(data);

      const nombres = obtenerNombresCategoriasDesdePresupuestos(data);
      setCategoriasDePresupuestos(nombres);
    } catch (error) {
      console.error("Error al obtener presupuestos:", error);
    }
  };

  const obtenerNombresCategoriasDesdePresupuestos = (presupuestos) => {
    const nombres = [];

    presupuestos.forEach((presupuesto) => {
      if (Array.isArray(presupuesto.categorias)) {
        presupuesto.categorias.forEach((c) => {
          if (c.categoria?.titulo) {
            nombres.push(c.categoria.titulo);
          }
        });
      }
    });

    return nombres;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const fetchCategorias = async () => {
      try {
        if (!token) throw new Error("No token disponible, inicia sesión.");

        const res = await axios.get(
          `http://localhost:3000/api/categorias/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Asegurarse de que res.data existe y es un array
        if (Array.isArray(res.data)) {
          setCategorias(res.data);
        } else if (res.data && Array.isArray(res.data.categorias)) {
          // Alternativa si la API devuelve { categorias: [...] }
          setCategorias(res.data.categorias);
        } else {
          console.error(
            "Formato de respuesta de categorías incorrecto:",
            res.data
          );
          setCategorias([]);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setCategorias([]);
      }
    };

    fetchCategorias();
  }, []);

  // Fetch presupuestos inicial
  useEffect(() => {
    fetchPresupuestos();
    // eslint-disable-next-line
  }, [setCategorias]);

  // Helpers
  const obtenerNombreCategoria = (id) => {
    if (!id) return "Sin categoría";

    const categoria = categorias.find((cat) => cat._id === id);
    return categoria ? categoria.titulo : "Sin categoría";
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
      limite: presupuestoSeleccionado.limite || "",
      dinero_disponible: presupuestoSeleccionado.dinero_disponible || "",
      categoria_asociada: presupuestoSeleccionado.categoria_asociada || "",
      periodo: presupuestoSeleccionado.periodo || "",
      categorias: presupuestoSeleccionado.categorias || ""
    });
    setModalMode("editar");
    setModalOpen(true);
  };

  const abrirModalVer = (presupuesto) => {
    setPresupuestoSeleccionado(presupuesto);
    setFormData({
      titulo: presupuesto.titulo || "",
      descripcion: presupuesto.descripcion || "",
      limite: presupuesto.limite || "",
      dinero_disponible: presupuesto.dinero_disponible || "",
      categoria_asociada: presupuesto.categoria_asociada || "",
      periodo: presupuesto.periodo || "",
      categorias: presupuesto.categorias || [], // ✅ aquí está el fix
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
  // En handleSubmit, antes de enviar los datos:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log("=== Iniciando handleSubmit ===");
    console.log("formData:", formData);

    const validacion = validarCampos(formData);
    if (validacion) {
      setError(validacion);
      return;
    }

    const limitePresupuesto = Number(formData.limite);
    if (isNaN(limitePresupuesto) || limitePresupuesto <= 0) {
      setError("El límite del presupuesto debe ser un número válido mayor que 0.");
      return;
    }

    // Sumar límites de las categorías
    const sumaCategorias = (formData.categorias || []).reduce((total, cat, i) => {
      const limiteCat = Number(cat.limite);
      console.log(`Categoría ${i} - Nombre: ${cat.nombre} | Límite: ${cat.limite} ->`, limiteCat);
      return total + (isNaN(limiteCat) ? 0 : limiteCat);
    }, 0);

    console.log("Límite del presupuesto:", limitePresupuesto);
    console.log("Suma de límites de categorías:", sumaCategorias);

    if (sumaCategorias > limitePresupuesto) {
      setError(
        `La suma de los límites de las categorías (${sumaCategorias}) excede el límite total del presupuesto (${limitePresupuesto}).`
      );
      return;
    }

    const categoriasFormateadas = (formData.categorias || []).map(cat => ({
      ...cat,
      limite: Number(cat.limite),
      dinero_disponible: Number(cat.limite)
    }));

    const dataToSubmit = {
      ...formData,
      limite: limitePresupuesto,
      dinero_disponible: limitePresupuesto,
      categorias: categoriasFormateadas
    };

    setLoading(true);
    const userId = localStorage.getItem("userId");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado. Inicie sesión.");

      const cleanData = limpiarDatos(dataToSubmit);
      console.log("Datos preparados para POST:", cleanData);

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
      console.error("Error al crear:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  // También modificar handleUpdate de manera similar:
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    console.log("=== Iniciando handleUpdate ===");
    console.log("formData:", formData);

    const validacion = validarCampos(formData);
    if (validacion) {
      setError(validacion);
      return;
    }

    const limitePresupuesto = Number(formData.limite);
    if (isNaN(limitePresupuesto) || limitePresupuesto <= 0) {
      setError("El límite del presupuesto debe ser un número válido mayor que 0.");
      return;
    }

    // Sumar límites de categorías
    const sumaCategorias = (formData.categorias || []).reduce((total, cat, i) => {
      const limiteCategoria = Number(cat.limite);
      console.log(`Categoría ${i} - Nombre: ${cat.nombre} | Límite: ${cat.limite} ->`, limiteCategoria);
      return total + (isNaN(limiteCategoria) ? 0 : limiteCategoria);
    }, 0);

    console.log("Límite del presupuesto:", limitePresupuesto);
    console.log("Suma de límites de categorías:", sumaCategorias);

    if (sumaCategorias > limitePresupuesto) {
      setError(
        `La suma de los límites de las categorías (${sumaCategorias}) excede el límite total del presupuesto (${limitePresupuesto}).`
      );
      return;
    }

    const dataToUpdate = {
      ...formData,
      limite: limitePresupuesto,
      dinero_disponible: limitePresupuesto,
      categorias: (formData.categorias || []).map((cat) => ({
        ...cat,
        limite: Number(cat.limite),
        dinero_disponible: Number(cat.limite)
      }))
    };

    const userId = localStorage.getItem("userId");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado. Inicie sesión.");

      const dataLimpia = limpiarDatos(dataToUpdate);
      console.log("Datos preparados para PATCH:", dataLimpia);

      await axios.patch(
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
      console.error("Error al actualizar:", err);
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

  // Obtener todos los IDs de categorías anidadas usadas en presupuestos
  const idsCategoriasUsadas = new Set(
    presupuestos.flatMap(p =>
      (p.categorias || []).map(catObj => catObj.categoria?._id)
    )
  );

  // Filtrar lista completa de categorías para quedarte solo con las que están en uso
  const categoriasUsadas = categorias.filter(c =>
    idsCategoriasUsadas.has(c._id)
  );

  const periodosUsados = [...new Set(presupuestos.map(p => p.periodo))];


  const presupuestosFiltrados = presupuestos.filter((p) => {
    const coincideCategoria = filtroCategoria
      ? (p.categorias || []).some(catObj => catObj.categoria?._id === filtroCategoria)
      : true;

    const coincidePeriodo = filtroPeriodo
      ? p.periodo === filtroPeriodo
      : true;

    const coincideBusqueda = busqueda
      ? p.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
      : true;

    return coincideCategoria && coincidePeriodo && coincideBusqueda;
  });

  // Paginación
  const totalPaginas = Math.ceil(presupuestosFiltrados.length / ITEMS_PER_PAGE);

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
  const dataGraph = React.useMemo(() => {
  if (
    !presupuestoSeleccionado ||
    !Array.isArray(presupuestoSeleccionado.categorias)
  ) {
    return {
      labels: [],
      datasets: [],
    };
  }

  const presupuestoTotal = Number(presupuestoSeleccionado.limite || 0);
  const dineroDisponibleTotal = Number(presupuestoSeleccionado.dinero_disponible || 0);
  const dineroGastadoTotal = Math.max(0, presupuestoTotal - dineroDisponibleTotal);

  // Categorías y sus datos disponibles
  const categoriaLabels = [];
  const categoriaData = [];

  presupuestoSeleccionado.categorias.forEach((cat) => {
    const titulo = cat?.categoria?.titulo || "Sin título";
    const disponible = Number(cat?.dinero_disponible || 0);

    categoriaLabels.push(titulo);
    categoriaData.push(disponible);
  });

  const sumaDisponibleEnCategorias = categoriaData.reduce((a, b) => a + b, 0);

  const restoPresupuesto = Math.max(0, dineroDisponibleTotal - sumaDisponibleEnCategorias);

  // Construir datos finales
  const labels = [...categoriaLabels];
  const data = [...categoriaData];

  if (restoPresupuesto > 0) {
    labels.push("Resto del presupuesto");
    data.push(restoPresupuesto);
  }

  if (dineroGastadoTotal > 0) {
    labels.push("Gastado");
    data.push(dineroGastadoTotal);
  }

  const backgroundColors = [
    "#4caf50",
    "#2196f3",
    "#ff9800",
    "#e91e63",
    "#9c27b0",
    "#00bcd4",
    "#cddc39",
    "#9e9e9e", // Resto
    "#f44336", // Gastado
  ];

  return {
    labels,
    datasets: [
      {
        label: "Distribución del Presupuesto",
        data,
        backgroundColor: backgroundColors.slice(0, data.length),
        borderWidth: 1,
      },
    ],
  };
}, [presupuestoSeleccionado]);


const optionsDona = {
  plugins: {
    datalabels: {
      color: "#fff",
      font: {
        weight: "bold",
        size: 14,
      },
      formatter: (value) => `$${value.toLocaleString()}`,
    },
    legend: {
      display: true,
      position: "bottom",
    },
  },
};


  const dataGraph2 = React.useMemo(() => {
  if (
    !presupuestoSeleccionado ||
    !Array.isArray(presupuestoSeleccionado.categorias)
  ) {
    return {
      labels: [],
      datasets: [],
    };
  }

  const dineroDisponibleTotal = Number(presupuestoSeleccionado.dinero_disponible || 0);
  const presupuestoTotal = Number(presupuestoSeleccionado.limite || 0);
  const dineroGastado = Math.max(0, presupuestoTotal - dineroDisponibleTotal);

  const categoriaLabels = [];
  const categoriaData = [];

  presupuestoSeleccionado.categorias.forEach((cat) => {
    const titulo = cat?.categoria?.titulo || "Sin título";
    const disponible = Number(cat?.dinero_disponible || 0);

    categoriaLabels.push(titulo);
    categoriaData.push(disponible);
  });

  const sumaDisponibleEnCategorias = categoriaData.reduce((a, b) => a + b, 0);
  const restoDisponible = Math.max(0, dineroDisponibleTotal - sumaDisponibleEnCategorias);

  const labels = [...categoriaLabels];
  const data = [...categoriaData];

  if (restoDisponible > 0) {
    labels.push("Resto del presupuesto");
    data.push(restoDisponible);
  }

  if (dineroGastado > 0) {
    labels.push("Gastado");
    data.push(dineroGastado);
  }

  const backgroundColors = [
    "#4caf50",
    "#2196f3",
    "#ff9800",
    "#e91e63",
    "#9c27b0",
    "#00bcd4",
    "#cddc39",
    "#9e9e9e", // Resto
    "#f44336", // Gastado
  ];

  return {
    labels,
    datasets: [
      {
        label: "Dinero Disponible por Categoría",
        data,
        backgroundColor: backgroundColors.slice(0, data.length),
        borderWidth: 1,
      },
    ],
  };
}, [presupuestoSeleccionado]);


const options = {
  scales: {
    x: {
      ticks: {
        display: true, // Oculta etiquetas del eje X
      },
      grid: {
        display: false,
      },
    },
    y: {
  beginAtZero: true,
  max: Number(presupuestoSeleccionado?.limite || 0) * 1,
  ticks: {
    display: true,
  },
  grid: {
    display: true,
  },
  title: {
    display: true,
    text: "Límite del presupuesto",
    color: "#666",      // Opcional: color de la etiqueta
    font: {
      size: 14,
      weight: "bold",
    },
  },
},
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
    datalabels: {
      color: "#000",
      anchor: "end",
      align: "top",
      font: {
        weight: "bold",
        size: 12,
      },
      formatter: (value) => value,
    },
  },
};

  const exportarPDF = () => {
    const doc = new jsPDF();

    const columnas = [
      "Título",
      "Descripción",
      "Limite",
      "Dinero Disponible",
      "Periodo",
      "Categorías",
      "Fecha",
    ];

    // filas: cada presupuesto es un array con sus datos
    const filas = presupuestosFiltrados.map((p) => [
      p.titulo || "",
      p.descripcion || "",
      `$${Number(p.limite || 0).toFixed(2)}`,
      `$${Number(p.dinero_disponible || 0).toFixed(2)}`,
      p.periodo || "",
      // Extraemos todos los títulos de categorías y los unimos con coma
      p.categorias && p.categorias.length > 0
        ? p.categorias.map((catObj) => catObj.categoria.titulo).join(", ")
        : "Sin categoría",
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
            Gestión de Presupuestos Financieros
          </h1>
          <p>
            Administra tus presupuestos para un mejor control de tus finanzas
            personales
          </p>
        </div>
        {error && <div className="error-message">{error}</div>}


        <div className="brine-intro">
          <h2 onClick={() => setIsOpenBudget(!isOpenBudget)} style={{ cursor: "pointer" }}>
            ¿Qué puedes hacer con los Presupuestos?
            <span
              style={{
                display: "inline-block",
                marginLeft: "8px",
                transform: isOpenBudget ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease"
              }}
            >
              ▶
            </span>
          </h2>

          <div
            ref={budgetRef}
            className="brine-intro-content"
            style={{
              maxHeight: isOpenBudget ? `${budgetRef.current?.scrollHeight}px` : "0px",
              opacity: isOpenBudget ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 0.5s ease, opacity 0.4s ease"
            }}
          >
            <div className="intro-box">
              <p>
                Un presupuesto es un ingreso fijo que se renueva cada cierto tiempo (por ejemplo, semanal, quincenal o mensual).
                Su propósito es ayudarte a controlar tus gastos y distribuir tu dinero en diferentes categorías.
              </p>

              <div className="example-box">
                <p><strong>Ejemplo:</strong></p>
                <p>
                  Supongamos que creas un presupuesto llamado <strong>“Gastos Personales”</strong> con un límite mensual de <strong>$2,000 pesos</strong>.
                  Lo divides en:
                </p>
                <ul>
                  <li>Transporte: $500</li>
                  <li>Comida: $1,000</li>
                  <li>Entretenimiento: $500</li>
                </ul>
                <p>
                  Si realizas una compra de comida por $150 pesos, podrás registrarla como una transacción
                  y el sistema restará automáticamente ese gasto del presupuesto correspondiente.
                </p>
              </div>

              <p><strong>En resumen:</strong></p>
              <ul className="summary-list">
                <li>Crea presupuestos con un límite definido y un periodo de renovación.</li>
                <li>Asigna montos a diferentes categorías.</li>
                <li>Registra transacciones y actualiza el saldo de forma automática.</li>
                <li>Consulta tu historial de gastos en cada categoría.</li>
                <li>Visualiza cuánto dinero te queda disponible en todo momento.</li>
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
                {cat.titulo}
              </option>
            ))}
          </select>
          <select
            id="filtroPeriodo"
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
          >
            <option value="">Todos los periodos</option>
            {periodosUsados.map((periodo) => (
              <option key={periodo} value={periodo}>
                {periodo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="presupuestos-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Limite</th>
            <th>Dinero Disponible</th>
            <th>Periodo</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {presupuestosPaginados.map((presupuesto) => (
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
              <td>${Number(presupuesto.limite || 0).toFixed(2)}</td>
              <td>${Number(presupuesto.dinero_disponible || 0).toFixed(2)}</td>
              <td>{presupuesto.periodo || ""}</td>
              <td>
                {presupuesto.categorias && presupuesto.categorias.length > 0
                  ? presupuesto.categorias.map((catObj, index) => (
                    <span key={index}>
                      {catObj.categoria.titulo}
                      {index < presupuesto.categorias.length - 1 ? ", " : ""}
                    </span>
                  ))
                  : "Sin categoría"}
              </td>
            </tr>
          ))}
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

      {/* <PresupuestoResumen presupuestos={presupuestos} /> */}

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
                  esFormularioValido={esFormularioValido}
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
                  esFormularioValido={esFormularioValido}
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
                    <strong>Límite:</strong> ${Number(formData.limite).toFixed(2)}
                  </p>
                  <p>
                    <strong>Dinero Disponible:</strong> ${Number(formData.dinero_disponible).toFixed(2)}
                  </p>
                  <p>
                    <strong>Periodo:</strong> {formData.periodo}
                  </p>
                  <div>
                    <p>
                      <strong>Categorías:</strong>
                    </p>
                    {" "}
                    {Array.isArray(presupuestoSeleccionado?.categorias) &&
                      presupuestoSeleccionado.categorias.length > 0 ? (
                      <ul>
                        {" "}
                        {presupuestoSeleccionado.categorias.map(
                          (catObj, index) => {
                            const titulo =
                              catObj?.categoria?.titulo || "Sin título";
                            const limite =
                              catObj?.limite != null
                                ? `$${Number(catObj.limite).toFixed(2)}`
                                : "Sin límite";
                            const dinero_disponible =
                              catObj?.dinero_disponible != null
                                ? `$${Number(catObj.dinero_disponible).toFixed(2)}`
                                : "Sin límite";
                            return (
                              <li key={index}>
                                {" "}
                                {titulo} — Límite: {limite} - Dinero disponible: {dinero_disponible}  {" "}
                              </li>
                            );
                          }
                        )}{" "}
                      </ul>
                    ) : (
                      <p>No hay categorías asignadas.</p>
                    )}
                  </div>

                  <p><strong> Fecha de creación: </strong>{" "}{presupuestoSeleccionado.fecha_creacion
                    ? new Date(presupuestoSeleccionado.fecha_creacion).toLocaleDateString()
                    : ""}</p>


                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {presupuestoSeleccionado && (
                      <div className="grafico-ahorro">
                        <h3>Estado del Presupuesto</h3>
                        <Doughnut data={dataGraph} options={optionsDona}/>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {presupuestoSeleccionado && (
                      <div className="grafico-ahorro">
                        <h3>Distribución por Categorias</h3>
                        <Bar data={dataGraph2} options={options}/>
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
