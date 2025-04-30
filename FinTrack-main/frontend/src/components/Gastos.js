import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Gastos() {
  const [gastos, setGastos] = useState([]);
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const usuarioId = '123';

  const cargar = async () => {
    const res = await axios.get(`http://localhost:3000/api/gastos/${usuarioId}`);
    setGastos(res.data);
  };

  const agregar = async () => {
    if (!monto || !categoria) return alert('Completa todos los campos');
    await axios.post('http://localhost:3000/api/gastos', {
      monto: parseFloat(monto),
      categoria,
      usuarioId,
    });
    setMonto('');
    setCategoria('');
    cargar();
  };

  const total = gastos.reduce((sum, g) => sum + g.monto, 0);

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Resumen de Finanzas</h2>
      <div style={styles.total}>Total Gastado: ${total.toFixed(2)}</div>

      <div style={styles.form}>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Monto"
          style={styles.input}
        />
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          placeholder="Categoría"
          style={styles.input}
        />
        <button onClick={agregar} style={styles.button}>Agregar Gasto</button>
      </div>

      <h3 style={styles.subTitle}>Historial de Gastos</h3>
      <ul style={styles.list}>
        {gastos.map((g, i) => (
          <li key={i} style={{ ...styles.item, borderLeft: `5px solid ${colores[g.categoria.toLowerCase()] || '#007bff'}` }}>
            <strong>${g.monto}</strong> - {g.categoria}
            <span style={styles.date}>{new Date(g.fecha).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const colores = {
  comida: '#ff7f50',
  transporte: '#ffa500',
  entretenimiento: '#6a5acd',
  salud: '#20b2aa',
  otros: '#007bff',
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  total: {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '2rem',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  subTitle: {
    fontSize: '1.2rem',
    marginBottom: '10px',
    color: '#444',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    background: '#f8f9fa',
    padding: '10px 15px',
    marginBottom: '10px',
    borderRadius: '6px',
    position: 'relative',
  },
  date: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#666',
    marginTop: '4px',
  },
};

export default Gastos;
