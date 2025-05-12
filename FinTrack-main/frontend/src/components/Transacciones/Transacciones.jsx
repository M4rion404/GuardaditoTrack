import React, { useState } from 'react';
import './Transacciones.css';

const Transacciones = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [formularioActivo, setFormularioActivo] = useState(false);
  const [nueva, setNueva] = useState({ descripcion: '', monto: '', tipo: 'gasto' });

  const handleChange = (e) => {
    setNueva({ ...nueva, [e.target.name]: e.target.value });
  };

  const agregarTransaccion = () => {
    if (!nueva.descripcion.trim() || !nueva.monto) return;
    const transaccion = {
      ...nueva,
      id: Date.now(),
      monto: parseFloat(nueva.monto),
      fecha: new Date().toLocaleDateString()
    };
    setTransacciones([transaccion, ...transacciones]);
    setNueva({ descripcion: '', monto: '', tipo: 'gasto' });
    setFormularioActivo(false);
  };

  return (
    <div className="transacciones-container">
      <div className="transacciones-intro">
        <h2>¿Qué puedes hacer aquí?</h2>
        <p>Registra tus ingresos y gastos para llevar un control detallado de cada movimiento financiero.</p>
      </div>

      <div className="transacciones-scroll">
        <div className="transacciones-seccion">
          <button
            className={`transacciones-toggle ${formularioActivo ? 'activo' : ''}`}
            onClick={() => setFormularioActivo(!formularioActivo)}
          >
            {formularioActivo ? '✖ Cerrar formulario' : '+ Registrar nueva transacción'}
          </button>

          {formularioActivo && (
            <div className="transacciones-formulario">
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción"
                value={nueva.descripcion}
                onChange={handleChange}
              />
              <input
                type="number"
                name="monto"
                placeholder="Monto"
                value={nueva.monto}
                onChange={handleChange}
              />
              <select name="tipo" value={nueva.tipo} onChange={handleChange}>
                <option value="gasto">Gasto</option>
                <option value="ingreso">Ingreso</option>
              </select>
              <button className="btn-agregar" onClick={agregarTransaccion}>
                Guardar transacción
              </button>
            </div>
          )}
        </div>

        <div className="transacciones-listado">
          {transacciones.length === 0 ? (
            <p className="transacciones-vacio">No hay transacciones registradas aún.</p>
          ) : (
            transacciones.map((t) => (
              <div key={t.id} className={`transaccion-card ${t.tipo}`}>
                <div>
                  <h4>{t.descripcion}</h4>
                  <p>{t.fecha}</p>
                </div>
                <span>
                  {t.tipo === 'ingreso' ? '+' : '-'}${t.monto.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Transacciones;
