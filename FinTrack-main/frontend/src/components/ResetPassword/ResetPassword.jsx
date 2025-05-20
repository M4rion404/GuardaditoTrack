
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './ResetPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica del email
    if (!email || !email.includes('@')) {
      setMessage('Por favor ingrese un correo electrónico válido');
      return;
    }

    // Simular el envío del correo de restablecimiento
    setMessage('');
    setStep(2);
    
    // En una aplicación real, aquí enviarías una solicitud al backend
    // para enviar el correo de restablecimiento
    console.log('Enviando email de recuperación a:', email);
  };

  return (
    <motion.div
      initial={{ x: '50vh', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="left-panel">
          <div className="illustration">
            <img alt="LoginImg" />
          </div>
        </div>

        <div className="right-panel">
          <Link to="/Login" className="boton-clase">
            <FaArrowLeft /> Regresar
          </Link>

          <h1>FinTrack</h1>
          <a>Aprende, ahorra y crece</a>

          {step === 1 ? (
            <>
              <h2>Recuperar contraseña</h2>
              <p className="reset-description">
                Ingresa tu correo electrónico para recibir un enlace de restablecimiento de contraseña.
              </p>

              <form className="form" onSubmit={handleSubmit}>
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

                {message && <div className="error-message">{message}</div>}

                <button type="submit" className="reset-button">
                  Enviar instrucciones
                </button>

                <div className="links">
                  <Link to="/Login">¿Ya recuerdas tu contraseña? Inicia sesión</Link>
                </div>
              </form>
            </>
          ) : (
            <div className="success-container">
              <div className="success-icon">
                <FaCheck />
              </div>
              <h2>¡Correo enviado!</h2>
              <p className="reset-description">
                Hemos enviado un correo a <strong>{email}</strong> con las instrucciones 
                para restablecer tu contraseña.
              </p>
              <p className="reset-note">
                Si no encuentras el correo en tu bandeja de entrada, revisa la carpeta de spam.
              </p>
              <button 
                className="reset-button"
                onClick={() => {
                  setStep(1);
                  setEmail('');
                }}
              >
                Volver a intentar
              </button>
              <div className="links">
                <Link to="/Login">Volver al inicio de sesión</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResetPassword;