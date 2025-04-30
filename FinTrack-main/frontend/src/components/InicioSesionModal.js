import React, { useState } from 'react';

const InicioSesionModal = ({ onClose, onOpenRegistro, onOpenRecuperarContrasena }) => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contraseña })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert(`${data.mensaje}\nBienvenido, ${data.usuario.nombres}`);
        onClose(); // cerramos modal si login fue exitoso
      } else {
        alert(`Error: ${data.mensaje || 'No se pudo iniciar sesión'}`);
      }

    } catch (err) {
      alert('Error en la conexión con el servidor');
      console.error(err);
    }
  };

  return (
    <div
      className="modal"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          display: 'flex',
          flexDirection: 'row',
          borderRadius: '10px',
          width: '90%',
          maxWidth: '600px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          flexWrap: 'wrap'
        }}
      >
        <div
          style={{
            position: "relative", // clave para limitar los hijos posicionados
            flex: 1,
            backgroundColor: "#fdfd96",
            minHeight: "200px",
            borderTopLeftRadius: "10px",
            borderBottomLeftRadius: "10px",
            overflow: "hidden", // evita que los hijos se escapen
            maxWidth: "100%", // evita que el contenedor crezca más que la ventana
          }}
        >
          {/* Logotipo */}
          <img
            src="./Fintrack-Logo-Azul.png"
            alt="Logotipo Fintrack"
            style={{
              position: "absolute",
              top: "2%",
              left: "2%",
              width: "5vw",
              maxWidth: "125px",
              height: "auto",
            }}
          />

          {/* Texto FINTRACK */}
          <div
            style={{
              position: "absolute",
              top: "7%",
              left: "40%",
              fontSize: "30px",
              fontWeight: "bold",
              color: "#0097b2",
              whiteSpace: "nowrap",
            }}
          >
            FINTRACK
          </div>

          {/* Imagen inferior */}
          <img
            src="./FT-Foto1.png"
            alt="Imagen de fondo"
            style={{
              position: "absolute",
              top: "30%",
              left: "5%",
              width: "34vw",
              maxWidth: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </div>

        <div style={{
          flex: 1,
          padding: '20px',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#004aad', fontWeight: 'bold' }}>INICIAR SESIÓN</h2>
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="Usuario"
            style={{
              width: '120px',
              height: '120px',
              marginBottom: '20px'
            }}
          />
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button type="submit" style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Iniciar Sesión
            </button>
          </form>
          <p style={{ marginTop: '15px', color: '#555' }}>
            ¿No tienes una cuenta?{' '}
            <button onClick={onOpenRegistro} style={{
              backgroundColor: 'transparent',
              color: '#007BFF',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Regístrate aquí
            </button>
          </p>
          <p style={{ marginTop: '10px', color: '#555' }}>
            ¿Olvidaste tu contraseña?{' '}
            <button onClick={onOpenRecuperarContrasena} style={{
              backgroundColor: 'transparent',
              color: '#007BFF',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Recuperar Contraseña
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InicioSesionModal;
