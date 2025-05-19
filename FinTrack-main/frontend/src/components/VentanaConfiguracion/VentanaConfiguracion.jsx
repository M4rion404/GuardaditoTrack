import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const opcionesDivisa = [
  { divisa: "USD", nombre: "Dólar estadounidense" },
  { divisa: "MXN", nombre: "Peso mexicano" },
];

const opcionesVerificacion = [
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
];

const VentanaConfiguracion = ({ onClose }) => {
  const navigate = useNavigate();
  
  // Cargar usuario desde localStorage
  const usuarioLocal = JSON.parse(localStorage.getItem("usuario")) || {};

  const [formData, setFormData] = useState({
    nombres: usuarioLocal.nombres || "",
    apellido_paterno: usuarioLocal.apellido_paterno || "",
    apellido_materno: usuarioLocal.apellido_materno || "",
    notificacion: usuarioLocal.notificacion || false,
    divisa: usuarioLocal.tipo_divisa || [], // Cambiar de divisa a tipo_divisa
    tipo_verificacion: usuarioLocal.verificacion || "", // Cambiar de tipo_verificacion a verificacion
  });

  const [hoverGuardar, setHoverGuardar] = useState(false);
  const [hoverCerrar, setHoverCerrar] = useState(false);
  const [hoverCerrarSesion, setHoverCerrarSesion] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDivisaChange = (e) => {
    const { value, checked } = e.target;
    let nuevaListaDivisas = [...formData.divisa];

    if (checked) {
      if (!nuevaListaDivisas.find((d) => d.divisa === value)) {
        const opcion = opcionesDivisa.find((d) => d.divisa === value);
        if (opcion) nuevaListaDivisas.push(opcion);
      }
    } else {
      nuevaListaDivisas = nuevaListaDivisas.filter((d) => d.divisa !== value);
    }

    // Asegurar que siempre haya al menos una divisa seleccionada
    if (nuevaListaDivisas.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Debe seleccionar al menos una divisa",
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      divisa: nuevaListaDivisas,
    }));
  };

  const handleGuardar = async () => {
    // Validación: al menos una divisa debe estar seleccionada
    if (formData.divisa.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: "Debe seleccionar al menos una divisa",
        confirmButtonText: "OK"
      });
      return;
    }

    // Validación: debe haber un método de verificación seleccionado
    if (!formData.tipo_verificacion || formData.tipo_verificacion === "") {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: "Debe seleccionar un método de verificación",
        confirmButtonText: "OK"
      });
      return;
    }

    setGuardando(true);

    // Refrescar usuarioLocal para asegurarnos de tener datos actualizados
    const usuarioLocal = JSON.parse(localStorage.getItem("usuario")) || {};

    // Preparar datos para enviar
    const datosAEnviar = {
      nombres: formData.nombres.trim() || usuarioLocal.nombres,
      apellido_paterno: formData.apellido_paterno.trim() || usuarioLocal.apellido_paterno,
      apellido_materno: formData.apellido_materno.trim() || usuarioLocal.apellido_materno,
      notificacion: formData.notificacion,
      divisa: formData.divisa, // El controlador lo mapeará a tipo_divisa
      tipo_verificacion: formData.tipo_verificacion // El controlador lo mapeará a verificacion
    };

    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${usuarioLocal._id}/ActualizarUsuario`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosAEnviar),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error en la petición: ${res.statusText}`);
      }

      const data = await res.json();

      // Actualizar localStorage con los datos nuevos recibidos del servidor
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      
      Swal.fire({ 
        icon: "success", 
        title: "Usuario actualizado", 
        text: "Los datos del usuario se han actualizado correctamente.", 
        timer: 1500, 
        showConfirmButton: false 
      });
      
      onClose();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ 
        title: "Error al actualizar", 
        text: error.message || "Ha ocurrido un error al actualizar los datos", 
        icon: "error", 
        confirmButtonText: "OK"
      });
    }

    setGuardando(false);
  };

  const handleCerrarSesion = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se cerrará tu sesión actual",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Limpiar localStorage
        localStorage.removeItem("usuario");
        localStorage.clear();
        
        // Navegar a la página de inicio
        navigate("/");
      }
    });
  };

  const botonGuardarStyle = {
    backgroundColor: hoverGuardar ? "#0056b3" : "#007BFF",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "6px",
    cursor: guardando ? "not-allowed" : "pointer",
    boxShadow: hoverGuardar
      ? "0 4px 12px rgba(0,86,179,0.7)"
      : "0 2px 6px rgba(0,123,255,0.4)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    userSelect: "none",
    opacity: guardando ? 0.6 : 1,
    flex: "1",
    marginRight: "10px"
  };

  const botonCerrarStyle = {
    backgroundColor: hoverCerrar ? "#5a6268" : "#6c757d",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: hoverCerrar
      ? "0 4px 12px rgba(90,98,104,0.7)"
      : "0 2px 6px rgba(108,117,125,0.4)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    userSelect: "none",
    flex: "1",
    marginLeft: "10px"
  };

  const botonCerrarSesionStyle = {
    backgroundColor: hoverCerrarSesion ? "#c82333" : "#dc3545",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: hoverCerrarSesion
      ? "0 4px 12px rgba(200,35,51,0.7)"
      : "0 2px 6px rgba(220,53,69,0.4)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    userSelect: "none",
    marginBottom: "10px",
    width: "100%"
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 999,
        }}
      />

      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "380px",
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "-3px 0 8px rgba(0,0,0,0.2)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2>Configuración de Cuenta</h2>

        <label>
          Nombre:
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "10px" }}
            disabled={guardando}
          />
        </label>

        <label>
          Apellido Paterno:
          <input
            type="text"
            name="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "10px" }}
            disabled={guardando}
          />
        </label>

        <label>
          Apellido Materno:
          <input
            type="text"
            name="apellido_materno"
            value={formData.apellido_materno}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "10px" }}
            disabled={guardando}
          />
        </label>

        <fieldset style={{ marginBottom: "10px" }} disabled={guardando}>
          <legend>Divisa (seleccione al menos una):</legend>
          {opcionesDivisa.map(({ divisa, nombre }) => (
            <label
              key={divisa}
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginRight: "15px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                name="divisa"
                value={divisa}
                checked={formData.divisa.some((d) => d.divisa === divisa)}
                onChange={handleDivisaChange}
                style={{ marginRight: "6px" }}
              />
              {nombre}
            </label>
          ))}
        </fieldset>

        <label>
          Tipo de Verificación:
          <select
            name="tipo_verificacion"
            value={formData.tipo_verificacion}
            onChange={handleChange}
            disabled={guardando}
            style={{ width: "100%", marginBottom: "10px" }}
          >
            <option value="">Seleccione...</option>
            {opcionesVerificacion.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <input
            type="checkbox"
            name="notificacion"
            checked={formData.notificacion}
            onChange={handleChange}
            disabled={guardando}
            style={{ marginRight: "8px" }}
          />
          Recibir notificaciones
        </label>

        <div style={{ marginTop: "auto" }}>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <button
              style={botonGuardarStyle}
              onClick={handleGuardar}
              onMouseEnter={() => setHoverGuardar(true)}
              onMouseLeave={() => setHoverGuardar(false)}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button
              style={botonCerrarStyle}
              onClick={onClose}
              onMouseEnter={() => setHoverCerrar(true)}
              onMouseLeave={() => setHoverCerrar(false)}
              disabled={guardando}
            >
              Cerrar
            </button>
          </div>
          
          <button
            style={botonCerrarSesionStyle}
            onClick={handleCerrarSesion}
            onMouseEnter={() => setHoverCerrarSesion(true)}
            onMouseLeave={() => setHoverCerrarSesion(false)}
            disabled={guardando}
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default VentanaConfiguracion;