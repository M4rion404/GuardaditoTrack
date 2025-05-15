//InicioSesion.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaAngleLeft } from 'react-icons/fa';
import auditoriaLogin from '../../assets/AuditoriaFinancieraLogin.jpg';
import axios from "axios";
import { motion } from "framer-motion";
import '../InicioSesion/InicioSesion.css';

const InicioSesion = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');

  const manejadorInicioSesion = async (e) => {
    e.preventDefault();



    try {
      const respuesta = await fetch("http://localhost:3000/api/usuarios/login", {  // Ajusta el puerto si es necesario
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, contraseña })
      });

      const datos = await respuesta.json();
      console.log("Respuesta del backend: ", datos)

      if (respuesta.ok) {
        /* localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));
        navigate('/Home'); */

        localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));

        if (datos.usuario && datos.usuario.id) {
          localStorage.setItem('userId', datos.usuario.id); // ← Esto es CLAVE
        } else {
          console.warn("El ID del usuario no se encontró en la respuesta");
        }

        navigate('/Home');

      } else {
        alert(datos.mensaje || 'Error al iniciar sesión');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };


  return (
    <div className="container">
      <div className="left-panel">
        <div className="illustration">
          <img src={auditoriaLogin} alt="LoginImg" />
        </div>
      </div>

      <div className="right-panel">
        <div className="right-panel-titulo">
          <div className="titulo-header">
            <Link to="/" className="boton-clase"> <FaAngleLeft /></Link>
            <h1>FinTrack</h1>
          </div>
          <a> Aprende, ahorra y crece</a>
        </div>

        <form className="form" onSubmit={manejadorInicioSesion}>
          <div className='bienvenido'>
            <h2>¡Bienvenido de nuevo!</h2>
          </div>

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Recordar contraseña</label>
          </div>

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>

          <div className="links">
            <Link to="/SignUp">¿Todavía no tienes una cuenta? Regístrate</Link><br />
            <Link to="/ResetPassword">¿Olvidó su contraseña?</Link><br />
          </div>
        </form>
      </div>
    </div>
  );
};

export default InicioSesion;