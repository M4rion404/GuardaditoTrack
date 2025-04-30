import React, { useState } from 'react';

const RecuperarContraseñaModal = ({ onClose, onOpenIniciarSesion }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Correo electrónico para recuperar contraseña:', email);
        // Aquí puedes manejar la lógica para recuperar la contraseña
    };

    return (
        <div
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
            onClick={onClose}
        >
            <div
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
                onClick={(e) => e.stopPropagation()}
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

                {/* Sección del formulario */}
                <div style={{
                    flex: 1,
                    padding: '20px',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#004aad', fontWeight: 'bold' }}>RECUPERAR CONTRASEÑA</h2>
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/847/847969.png" 
                        alt="Recuperar Contraseña" 
                        style={{
                            width: '80px',
                            height: '80px',
                            marginBottom: '20px'
                        }}
                    />
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
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
                        <button type="submit" style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}>
                            Enviar enlace de recuperación
                        </button>
                    </form>
                    <p style={{ marginTop: '15px', color: '#555' }}>
                        ¿Ya recuerdas tu contraseña?{' '}
                        <button onClick={onOpenIniciarSesion} style={{
                            backgroundColor: 'transparent',
                            color: '#007BFF',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}>
                            Inicia sesión aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecuperarContraseñaModal;
