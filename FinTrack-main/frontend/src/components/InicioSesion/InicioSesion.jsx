import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaAngleLeft } from 'react-icons/fa';
import auditoriaLogin from '../../assets/AuditoriaFinancieraLogin.jpg';
import Swal from "sweetalert2";
import '../InicioSesion/InicioSesion.css';

const InicioSesion = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [recordar, setRecordar] = useState(false);

  const manejadorInicioSesion = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch("http://localhost:3000/api/usuarios/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contraseña }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));
        if (datos.usuario && datos.usuario._id) {
          localStorage.setItem('userId', datos.usuario._id);
        }
        if (recordar) {
          localStorage.setItem('recordarSesion', 'true');
        } else {
          localStorage.removeItem('recordarSesion');
        }

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: `Hola ${datos.usuario.nombre_usuario || ''}`,
          timer: 1500,
          showConfirmButton: false,
        });

        navigate('/Home');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: datos.mensaje || 'Credenciales inválidas',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="containerLogin"> 
      <div className="left-panelLogin">
        <div className="illustrationLogin">
          <img 
            src={auditoriaLogin} 
            alt="Auditoría Financiera" 
          />
        </div>
      </div>

      <div className="right-panelLogin">
        <div className="right-panel-tituloLogin">
          <div className="titulo-headerLogin">
            <Link to="/" className="botonLogin-clase">
              <FaAngleLeft />
            </Link>
            <h1>FinTrack</h1>
          </div>
          <p>Aprende, ahorra y crece</p>
        </div>

        <form className="formLogin" onSubmit={manejadorInicioSesion}>
          <div className="bienvenidoLogin">
            <h2>¡Bienvenido de nuevo!</h2>
          </div>

          <div className="input-groupLogin">
            <FaEnvelope className="iconLogin" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="input-groupLogin">
            <FaLock className="iconLogin" />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="checkbox-groupLogin">
            <input
              type="checkbox"
              id="remember"
              checked={recordar}
              onChange={() => setRecordar(!recordar)}
            />
            <label htmlFor="remember">Recordar contraseña</label>
          </div>

          <button type="submit" className="Login-button">
            Iniciar sesión
          </button>

          <div className="linksLogin">
            <Link to="/SignUp">¿Todavía no tienes una cuenta? Regístrate</Link><br />
            <Link to="/ResetPassword">¿Olvidó su contraseña?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InicioSesion;
