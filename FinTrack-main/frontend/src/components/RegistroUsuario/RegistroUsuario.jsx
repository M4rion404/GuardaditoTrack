import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaAngleLeft } from "react-icons/fa";
import RegistroImg from "../../assets/RegistroImagen.avif";
import "../RegistroUsuario/RegistroUsuario.css";
import { useState } from "react";
import Swal from "sweetalert2";

// Proceso para registrar un nuevo usuario
const RegistroUsuario = () => {
  const [nombres, setNombres] = useState("");
  const [apellido_paterno, setApellido_paterno] = useState("");
  const [apellido_materno, setApellido_materno] = useState("");
  const [numero_telefono, setnumero_Telefono] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const manejadorRegistro = async (e) => {

    e.preventDefault();
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

        // Guarda los datos del usuario en localStorage
        localStorage.setItem("usuarioRegistrado", JSON.stringify(data));
        Swal.fire({ icon:"success", title:"Bienvenido a FinTrack", text: "La cuenta ha sido generada correctamente.", timer:1500, showConfirmButton: false });
        navigate("/ConfiguracionRapida");
      } else {
        const errorData = await response.json();
        console.error("Error en el registro:", errorData);
        Swal.fire({ title: "Lo sentimos, ha ocurrido un error", text: "Parece que la conexión con el servidor ha fallado", icon: "warning", timer:1500, confirmButtonText: false, cancelButtonText: false});
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Swal.fire({ title: "Lo sentimos, ha ocurrido un error", text: "Parece que la conexión con el servidor ha fallado", icon: "warning", timer:1500, confirmButtonText: false, cancelButtonText: false});
    }
  };

  return (
    <div className="containerReg">
      <div className="right-panelReg">
        <div className="illustrationReg">
          <img src={RegistroImg} alt="RegistroImg" />
        </div>
      </div>

      <div className="left-panelReg">
        <div className="left-panel-tituloReg">
          <div className="titulo-headerReg">
            <Link to="/" className="botonReg-clase">
              {" "}
              <FaAngleLeft />
            </Link>
            <h1>FinTrack</h1>
          </div>
          <p> Aprende, ahorra y crece</p>
        </div>

        <form className="formReg" onSubmit={manejadorRegistro}>
          <div className="bienvenidoReg">
            <h2>¡Registrate Ahora!</h2>
          </div>

          <div className="input-groupReg">
            <FaLock className="iconReg" />
            <input
              type="text"
              placeholder="Nombre(s)"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              required
            />
          </div>

          <div className="input-groupReg">
            <FaLock className="iconReg" />
            <input
              type="text"
              placeholder="Apellido Paterno"
              value={apellido_paterno}
              onChange={(e) => setApellido_paterno(e.target.value)}
              required
            />
          </div>

          <div className="input-groupReg">
            <FaLock className="iconReg" />
            <input
              type="text"
              placeholder="Apellido Materno"
              value={apellido_materno}
              onChange={(e) => setApellido_materno(e.target.value)}
            />
          </div>

          <div className="input-groupReg">
            <FaLock className="iconReg" />
            <input
              type="phone"
              placeholder="Numero de Teléfono"
              value={numero_telefono}
              onChange={(e) => setnumero_Telefono(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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