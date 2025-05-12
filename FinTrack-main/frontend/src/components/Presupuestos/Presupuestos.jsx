import React, { useState } from 'react';
import './Presupuestos.css';

const Presupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [formularioActivo, setFormularioActivo] = useState(false);
  const [nuevo, setNuevo] = useState({ nombre: '', monto: '' });

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const agregarPresupuesto = () => {
    if (!nuevo.nombre.trim() || !nuevo.monto) return;
    setPresupuestos([
      ...presupuestos,
      { ...nuevo, id: Date.now(), monto: parseFloat(nuevo.monto) }
    ]);
    setNuevo({ nombre: '', monto: '' });
    setFormularioActivo(false);
  };

  return (
    <div className="presupuesto-container">
      <div className="presupuesto-intro">
        <h2>¿Qué puedes hacer aquí?</h2>
        <p>Registra y administra los presupuestos mensuales para controlar tus finanzas de forma organizada.</p>
      </div>

      <div className="presupuesto-scroll">
        <div className="presupuesto-seccion">
          <button
            className={`presupuesto-toggle ${formularioActivo ? 'activo' : ''}`}
            onClick={() => setFormularioActivo(!formularioActivo)}
          >
            {formularioActivo ? '✖ Cerrar formulario' : '+ Crear nuevo presupuesto'}
          </button>

          {formularioActivo && (
            <div className="presupuesto-formulario">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del presupuesto"
                value={nuevo.nombre}
                onChange={handleChange}
              />
              <input
                type="number"
                name="monto"
                placeholder="Monto"
                value={nuevo.monto}
                onChange={handleChange}
              />
              <button className="btn-agregar" onClick={agregarPresupuesto}>
                Agregar presupuesto
              </button>
            </div>
          )}
        </div>

        <div className="presupuesto-listado">
          {presupuestos.length === 0 ? (
            <p className="presupuesto-vacio">No hay presupuestos registrados aún.</p>
          ) : (
            presupuestos.map((item) => (
              <div key={item.id} className="presupuesto-card">
                <div>
                  <h4>{item.nombre}</h4>
                  <p>Monto asignado</p>
                </div>
                <span>${item.monto.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Presupuestos;

