import React, { useState, useEffect, useRef } from "react";
import "./Categorias.css";
import {
  FaPlus,
  FaChevronUp,
  FaTags,
  FaListUl,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const Categorias = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [categoriasGuardadas, setCategoriasGuardadas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const categoriasPorPagina = 5;
  const indiceUltimaCategoria = paginaActual * categoriasPorPagina;
  const indicePrimeraCategoria = indiceUltimaCategoria - categoriasPorPagina;
  const categoriasVisibles = categoriasGuardadas.slice(
    indicePrimeraCategoria,
    indiceUltimaCategoria
  );
  const totalPaginas = Math.ceil(
    categoriasGuardadas.length / categoriasPorPagina
  );
  const [isOpen, setIsOpen] = useState(false);
const contentRef = useRef(null);

  // Simulación de usuario autenticado
  //const idUsuario = '1234567890abcdef'; // Reemplaza con el ID real desde contexto o localStorage
  const API_URL = "http://localhost:3000/api/categorias";
  const idUsuario = localStorage.getItem("userId"); // IDuser automatica

  const fetchCategorias = async () => {
    try {
      setCargando(true);
      const res = await axios.get(`${API_URL}/${idUsuario}`);
      setCategoriasGuardadas(res.data);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
      setError("Error al cargar las categorías");
    } finally {
      setCargando(false);
    }
  };

  // Obtener categorías guardadas
  useEffect(() => {
    fetchCategorias();
  }, []);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    setEditandoId(null);
    setNuevaCategoria("");
    setDescripcion("");
    setError("");
  };

  const handleGuardarCategoria = async () => {
    if (!nuevaCategoria.trim()) {
      setError("Debes ingresar un nombre para la nueva categoría");
      return;
    }

    try {
      setCargando(true);
      const categoriaData = {
        titulo: nuevaCategoria.trim(),
        descripcion: descripcion.trim(),
      };

      let res;

      if (editandoId) {
        // Actualizar categoría existente
        res = await axios.put(`${API_URL}/${idUsuario}/${editandoId}`, categoriaData);
        setCategoriasGuardadas(
          categoriasGuardadas.map((cat) =>
            cat._id === editandoId ? res.data : cat
          )
        );

        await Swal.fire({
          icon: "success",
          title: "Categoría actualizada",
          text: "Los cambios se guardaron correctamente.",
          timer: 1500,
          showConfirmButton: false,
        });

      } else {
        // Crear nueva categoría
        res = await axios.post(`${API_URL}/${idUsuario}/`, categoriaData);
        setCategoriasGuardadas([...categoriasGuardadas, res.data]);

        await Swal.fire({
          icon: "success",
          title: "Categoría creada",
          text: "La nueva categoría fue registrada correctamente.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      await fetchCategorias();
      setNuevaCategoria("");
      setDescripcion("");
      setError("");
      setMostrarFormulario(false);
      setEditandoId(null);

    } catch (err) {
      console.error("Error al guardar categoría:", err);
      setError(err.response?.data?.message || "Error al guardar la categoría");

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la categoría.",
      });

    } finally {
      setCargando(false);
    }
  };

  const handleEditarCategoria = (categoria) => {
    setEditandoId(categoria._id);
    setNuevaCategoria(categoria.titulo);
    setDescripcion(categoria.descripcion);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminarCategoria = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la categoría permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      setCargando(true);
      await axios.delete(`${API_URL}/${idUsuario}/${id}`);
      setCategoriasGuardadas(categoriasGuardadas.filter((cat) => cat._id !== id));

      await Swal.fire({
        icon: "success",
        title: "Categoría eliminada",
        text: "La categoría fue eliminada correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      setError("Error al eliminar la categoría");

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la categoría.",
      });

    } finally {
      setCargando(false);
    }
  };


  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="brine-wrapper">
      {/* Encabezado */}
      <div className="brine-header">
        <button onClick={() => window.history.back()}>&larr; Regresar</button>
        <h1>
          <FaTags style={{ marginRight: "10px" }} />
          Gestión de Categorías Financieras
        </h1>
        <p>
          Administra tus categorías para un mejor control de tus finanzas
          personales
        </p>
      </div>

      {/* Mensaje de error general */}
      {error && <div className="error-message">{error}</div>}

      {/* Introducción */}
      <div className="brine-intro">
        <h2 onClick={() => setIsOpen(!isOpen)}>
          ¿Qué puedes hacer aquí?
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
          <p>
            Esta sección te permite crear nuevas categorías, organizar tus
            finanzas y visualizar rápidamente tus registros.
          </p>
          <ul>
            <li>Crear una nueva categoría personalizada.</li>
            <li>Gestionar las categorías que ya creaste.</li>
          </ul>
        </div>
      </div>

      {/* Formulario */}
      <div className="brine-form-section">
        <div className="brine-form-toggle" onClick={toggleFormulario}>
          {mostrarFormulario ? (
            <>
              <FaChevronUp /> Ocultar formulario
            </>
          ) : (
            <>
              <FaPlus />{" "}
              {editandoId ? "Editando categoría" : "Crear nueva categoría"}
            </>
          )}
        </div>

        <div
          className={`brine-form-container ${mostrarFormulario ? "active fadeIn" : ""
            }`}
        >
          <input
            type="text"
            placeholder="Nombre de la nueva categoría"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            disabled={cargando}
          />
          <textarea
            placeholder="Descripción (opcional)"
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={cargando}
          ></textarea>

          {error && <p className="error-message">{error}</p>}
          <button onClick={handleGuardarCategoria} disabled={cargando}>
            {cargando
              ? "Procesando..."
              : editandoId
                ? "Actualizar categoría"
                : "Guardar categoría"}
          </button>
        </div>
      </div>

      {/* Categorías guardadas */}
      <div className="brine-categorias-section">
        <h3>
          <FaListUl style={{ marginRight: "8px" }} />
          Categorías que has creado
        </h3>

        {cargando && categoriasGuardadas.length === 0 ? (
          <p>Cargando categorías...</p>
        ) : categoriasGuardadas.length === 0 ? (
          <p>Aún no has creado categorías.</p>
        ) : (
          <>
            <ul className="fadeIn">
              {categoriasVisibles.map((cat) => (
                <li key={cat._id}>
                  <div>
                    <strong>{cat.titulo}</strong>
                    <br />
                    <small>{cat.descripcion || "Sin descripción"}</small>
                  </div>
                  <div className="category-actions">
                    <button
                      onClick={() => handleEditarCategoria(cat)}
                      disabled={cargando}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleEliminarCategoria(cat._id)}
                      disabled={cargando}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {totalPaginas > 1 && (
              <div className="paginacion">
                {Array.from({ length: totalPaginas }, (_, index) => (
                  <button
                    key={index + 1}
                    className={paginaActual === index + 1 ? 'activo' : ''}
                    onClick={() => cambiarPagina(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>

        )}
      </div>
    </div>
  );
};

export default Categorias;
