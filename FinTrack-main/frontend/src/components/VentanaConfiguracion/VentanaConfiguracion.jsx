import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const CerrarSesion = () => {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    Swal.fire({
      title: "¿Estás seguro de cerrar sesión?",
      text: "Tendrás que volver a iniciar sesión para acceder a tu cuenta.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Abrir Historial",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("usuario");
        localStorage.clear();
        Swal.fire("Sesión cerrada", "Has cerrado sesión correctamente.", "success").then(() => {
          navigate("/");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Navegar al historial si se presiona "Abrir Historial"
        navigate("/Historial");
      }
    });
  };

  const irAlHistorial = () => {
    navigate("/Historial");
  };

  return (
    <div className="cerrar-sesion-container">
      <h2>Cerrar Sesión</h2>
      <p>
        ¿Deseas cerrar tu sesión actual? Puedes ver tu historial antes de salir.
      </p>
      <div className="botones-container">
        <button className="boton-cerrar-sesion" onClick={handleCerrarSesion}>
          Cerrar Sesión
        </button>
        <button className="boton-historial" onClick={irAlHistorial}>
          Ver Historial
        </button>
      </div>
    </div>
  );
};

export default CerrarSesion;
