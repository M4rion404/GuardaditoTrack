import React, { useState, useEffect } from 'react';
import './Categorias.css';
import { FaPlus, FaChevronUp, FaTags, FaListUl, FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';

const Categorias = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [categoriasGuardadas, setCategoriasGuardadas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Simulación de usuario autenticado
  const idUsuario = '1234567890abcdef'; // Reemplaza con el ID real desde contexto o localStorage
  const API_URL = 'http://localhost:3000/api/categorias';

  // Obtener categorías guardadas
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setCargando(true);
        const res = await axios.get(`${API_URL}/${idUsuario}`);
        setCategoriasGuardadas(res.data);
      } catch (err) {
        console.error('Error al obtener categorías:', err);
        setError('Error al cargar las categorías');
      } finally {
        setCargando(false);
      }
    };

    fetchCategorias();
  }, []);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    setEditandoId(null);
    setNuevaCategoria('');
    setDescripcion('');
    setError('');
  };

  const handleGuardarCategoria = async () => {
    if (!nuevaCategoria.trim()) {
      setError('Debes ingresar un nombre para la nueva categoría');
      return;
    }

    try {
      setCargando(true);
      const categoriaData = {
        nombre: nuevaCategoria.trim(),
        descripcion: descripcion.trim()
      };

      let res;
      if (editandoId) {
        // Actualizar categoría existente
        res = await axios.put(`${API_URL}/${idUsuario}/${editandoId}`, categoriaData);
        setCategoriasGuardadas(categoriasGuardadas.map(cat => 
          cat._id === editandoId ? res.data : cat
        ));
      } else {
        // Crear nueva categoría
        res = await axios.post(`${API_URL}/${idUsuario}`, categoriaData);
        setCategoriasGuardadas([...categoriasGuardadas, res.data]);
      }

      setNuevaCategoria('');
      setDescripcion('');
      setError('');
      setMostrarFormulario(false);
      setEditandoId(null);
    } catch (err) {
      console.error('Error al guardar categoría:', err);
      setError(err.response?.data?.message || 'Error al guardar la categoría');
    } finally {
      setCargando(false);
    }
  };

  const handleEditarCategoria = (categoria) => {
    setEditandoId(categoria._id);
    setNuevaCategoria(categoria.nombre);
    setDescripcion(categoria.descripcion);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminarCategoria = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      setCargando(true);
      await axios.delete(`${API_URL}/${idUsuario}/${id}`);
      setCategoriasGuardadas(categoriasGuardadas.filter(cat => cat._id !== id));
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      setError('Error al eliminar la categoría');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="brine-wrapper">
      {/* Encabezado */}
      <div className="brine-header">
        <button onClick={() => window.history.back()}>&larr; Regresar</button>
        <h1><FaTags style={{ marginRight: '10px' }} />Gestión de Categorías Financieras</h1>
        <p>Administra tus categorías para un mejor control de tus finanzas personales</p>
      </div>

      {/* Mensaje de error general */}
      {error && <div className="error-message">{error}</div>}

      {/* Introducción */}
      <div className="brine-intro">
        <h2>¿Qué puedes hacer aquí?</h2>
        <p>Esta sección te permite crear nuevas categorías, organizar tus finanzas y visualizar rápidamente tus registros.</p>
        <ul>
          <li>Crear una nueva categoría personalizada.</li>
          <li>Gestionar las categorías que ya creaste.</li>
        </ul>
      </div>

      {/* Formulario */}
      <div className="brine-form-section">
        <div className="brine-form-toggle" onClick={toggleFormulario}>
          {mostrarFormulario ? (
            <><FaChevronUp /> Ocultar formulario</>
          ) : (
            <><FaPlus /> {editandoId ? 'Editando categoría' : 'Crear nueva categoría'}</>
          )}
        </div>

        <div className={`brine-form-container ${mostrarFormulario ? 'active fadeIn' : ''}`}>
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
          <button 
            onClick={handleGuardarCategoria}
            disabled={cargando}
          >
            {cargando ? 'Procesando...' : editandoId ? 'Actualizar categoría' : 'Guardar categoría'}
          </button>
        </div>
      </div>

      {/* Categorías guardadas */}
      <div className="brine-categorias-section">
        <h3><FaListUl style={{ marginRight: '8px' }} />Categorías que has creado</h3>
        
        {cargando && categoriasGuardadas.length === 0 ? (
          <p>Cargando categorías...</p>
        ) : categoriasGuardadas.length === 0 ? (
          <p>Aún no has creado categorías.</p>
        ) : (
          <ul className="fadeIn">
            {categoriasGuardadas.map((cat) => (
              <li key={cat._id}>
                <div>
                  <strong>{cat.nombre}</strong><br />
                  <small>{cat.descripcion || 'Sin descripción'}</small>
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
        )}
      </div>
    </div>
  );
};

export default Categorias;
