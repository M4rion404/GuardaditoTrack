import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Categorias.css';
import axios from 'axios';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/categorias');
      setCategorias(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Error al cargar las categorías');
    }
  };

  const crearCategoria = async () => {
    if (!titulo.trim()) {
      setError('El título es requerido');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const categoriaData = {
        Titulo: titulo, // Note the capital T to match backend expectation
        Descripcion: descripcion // Capital D if backend expects it
      };

      const response = await axios.post('http://localhost:3000/api/categorias', categoriaData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Category created:', response.data);
      setTitulo('');
      setDescripcion('');
      await fetchCategorias(); // Refresh the list
    } catch (error) {
      console.error('Error creating category:', error);
      if (error.response?.data?.detalles) {
        setError(error.response.data.detalles);
      } else {
        setError('Error al crear la categoría');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contenedor-categorias">
      <button className="boton-regresar" onClick={() => navigate('/Home')}>⬅ Regresar</button>

      <div className="bienvenida-categorias">
        <h1>¡Gestión de Categorías!</h1>
        <p>Organiza tu información financiera creando categorías personalizadas.</p>
      </div>

      <section className="pasos-categorias">
        <h2>¿Qué puedes hacer aquí?</h2>
        <ul>
          <li>Crear categorías para tus gastos o ingresos.</li>
          <li>Organizar mejor tus finanzas.</li>
          <li>Clasificar transacciones de manera eficiente.</li>
        </ul>
      </section>

      <div className="formulario-categoria">
        <h2>Crear Nueva Categoría</h2>
        {error && <div className="error-message">{error}</div>}
        <input 
          type="text" 
          placeholder="Título" 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
          disabled={isSubmitting}
        />
        <textarea 
          placeholder="Descripción" 
          value={descripcion} 
          onChange={(e) => setDescripcion(e.target.value)} 
          disabled={isSubmitting}
        />
        <button 
          onClick={crearCategoria} 
          disabled={isSubmitting || !titulo.trim()}
        >
          {isSubmitting ? 'Creando...' : 'Crear Categoría'}
        </button>
      </div>

      <div className="lista-categorias">
        <h2>Categorías Registradas</h2>
        {categorias.length > 0 ? (
          <ul>
            {categorias.map((cat) => (
              <li key={cat._id || cat.id}>
                <strong>{cat.Titulo || cat.titulo || cat.nombre}</strong> - {cat.Descripcion || cat.descripcion}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay categorías registradas.</p>
        )}
      </div>
    </div>
  );
};

export default Categorias;