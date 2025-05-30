import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaAngleLeft, FaUser, FaPhone } from "react-icons/fa";
import RegistroImg from "../../assets/RegistroImagen.avif";
import "../RegistroUsuario/RegistroUsuario.css";
import Swal from "sweetalert2";

const RegistroUsuario = () => {
  const [nombre_usuario, setNombre_usuario] = useState("");
  const [numero_telefono, setNumero_Telefono] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setconfirmarContraseña] = useState("");

  const navigate = useNavigate();

  const manejadorRegistro = async (e) => {
    e.preventDefault();

    if (contraseña !== confirmarContraseña) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const userData = {
      nombre_usuario,
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
        localStorage.setItem("usuarioRegistrado", JSON.stringify(data));
        Swal.fire({
          icon: "success",
          title: "Bienvenido a FinTrack",
          text: "La cuenta ha sido generada correctamente.",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/Login");
      } else {
        const errorData = await response.json();
        console.error("Error en el registro:", errorData);
        Swal.fire({
          title: "Lo sentimos, ha ocurrido un error",
          text: "Parece que la conexión con el servidor ha fallado",
          icon: "warning",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Swal.fire({
        title: "Lo sentimos, ha ocurrido un error",
        text: "Parece que la conexión con el servidor ha fallado",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="containerReg">
      <div
        className="right-panelReg"
        style={{
          backgroundImage: `url(${RegistroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Eliminamos el img porque el fondo ya está en el div */}
      </div>

      <div className="left-panelReg">
        <div className="left-panel-tituloReg">
          <div className="titulo-headerReg">
            <Link to="/" className="botonReg-clase">
              <FaAngleLeft />
            </Link>
            <h1>FinTrack</h1>
          </div>
          <p> Aprende, ahorra y crece</p>
        </div>

        <form className="formReg" onSubmit={manejadorRegistro}>
          <div className="bienvenidoReg">
            <h2>¡Regístrate ahora!</h2>
          </div>

          <div className="input-groupReg">
            <FaUser className="iconReg" />
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre_usuario}
              onChange={(e) => setNombre_usuario(e.target.value)}
              required
            />
          </div>

          <div className="input-groupReg">
            <FaPhone className="iconReg" />
            <input
              type="tel"
              placeholder="Teléfono"
              value={numero_telefono}
              onChange={(e) => setNumero_Telefono(e.target.value)}
              required
            />
          </div>

          <div className="input-groupReg">
            <FaEnvelope className="iconReg" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-groupReg">
            <FaLock className="iconReg" />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>

          <div className="input-groupReg">
            <FaLock className="iconReg" />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmarContraseña}
              onChange={(e) => setconfirmarContraseña(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="Register-button">
            Registrarse
          </button>
        </form>

        <p className="ya-tienes-cuenta">
          ¿Ya tienes una cuenta?
          <Link to="/Login"> Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegistroUsuario;
