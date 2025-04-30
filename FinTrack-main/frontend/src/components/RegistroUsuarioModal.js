import React, { useState } from "react";

const RegistroUsuarioModal = ({ onClose, onOpenIniciarSesion }) => {
  const [nombres, setNombres] = useState("");
  const [apellido_paterno, setApellido_paterno] = useState("");
  const [apellido_materno, setApellido_materno] = useState("");
  const [numero_telefono, setnumero_Telefono] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contraseña !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const userData = {
      nombres,
      apellido_paterno,
      apellido_materno,
      numero_telefono,
      email,
      contraseña,
    };

    try {
      const response = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registro exitoso:", data);
        alert("Usuario registrado exitosamente");
        onClose(); // Cierra el modal después del registro exitoso
      } else {
        const errorData = await response.json();
        console.error("Error en el registro:", errorData);
        alert("Error en el registro: " + errorData.message);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error al registrar el usuario");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          display: "flex",
          flexDirection: "row",
          borderRadius: "10px",
          width: "120%",
          maxWidth: "800px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
          flexWrap: "wrap",
          position: "relative",
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
              width: "15vw",
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
              fontSize: "35px",
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
        <div
          style={{
            flex: 1,
            padding: "20px",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
              color: "#004aad",
              fontWeight: "bold",
              fontSize: "30px",
            }}
          >
            REGISTRO DE USUARIO
          </h2>
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="Usuario"
            style={{
              width: "120px",
              height: "120px",
              marginBottom: "20px",
            }}
          />
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                placeholder="Nombres"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                placeholder="Apellido Paterno"
                value={apellido_paterno}
                onChange={(e) => setApellido_paterno(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                placeholder="Apellido Materno"
                value={apellido_materno}
                onChange={(e) => setApellido_materno(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="tel"
                placeholder="Número de Teléfono"
                value={numero_telefono}
                onChange={(e) => setnumero_Telefono(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="password"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Registrarse
            </button>
          </form>
          <p style={{ marginTop: "15px", color: "#555" }}>
            ¿Ya tienes una cuenta?{" "}
            <button
              onClick={onOpenIniciarSesion}
              style={{
                backgroundColor: "transparent",
                color: "#007BFF",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuarioModal;
