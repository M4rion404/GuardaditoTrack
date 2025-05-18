import React, { useState } from 'react';
import { Link } from "react-router-dom";
import logoFintrack from '../../assets/QuickStart.png';
import './ConfiguracionRapida.css';

const ConfiguracionRapida = () => {
  const [mensaje, setMensaje] = useState('');
  const [divisas, setDivisas] = useState({ usd: false, mxn: false });

  const handleDivisaChange = (e) => {
    const { name, checked } = e.target;
    setDivisas(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <div className='contenedor-principal'>

      <div className="panel-izquierdo">
        <div className="contenido-principal">
          <h1 className="titulo-principal">Preferencias de la cuenta</h1>
          <h3 className="subtitulo">Configuración rápida</h3>

          <div className='grupo-opciones-horizontal'>

            <div className="seccion-configuracion bloque-opciones">
              <label><strong>Selecciona tu método de verificación</strong></label>
              <div className="opciones-horizontal">
                <label><input type="radio" value="email" checked={mensaje === 'email'} onChange={() => setMensaje('email')} /> Email</label>
                <label><input type="radio" value="sms" checked={mensaje === 'sms'} onChange={() => setMensaje('sms')} /> SMS</label>
              </div>
            </div>

            <div className="seccion-configuracion bloque-opciones">
              <label><strong>Selecciona la o las divisas </strong></label>
              <div className="opciones-horizontal">
                <label><input type="checkbox" name="usd" checked={divisas.usd} onChange={handleDivisaChange} /> USD</label>
                <label><input type="checkbox" name="mxn" checked={divisas.mxn} onChange={handleDivisaChange} /> MXN</label>
              </div>
            </div>

          </div>

          <Link to="/home" className="boton">Continuar</Link>
        </div>
      </div>

      <div className="panel-derecho">
        <div className="img-logo-fintrack">
          <img src={logoFintrack} alt="Logo Fintrack" />  
        </div>

        <div className='descripcion-principal-contenedor'>
          <p className="descripcion-principal">
            Selecciona el método de autenticación que prefieras y monedas que usarás en FinTrack.<br/> <br/><b>Puedes cambiarlas luego en la configuración.</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionRapida;