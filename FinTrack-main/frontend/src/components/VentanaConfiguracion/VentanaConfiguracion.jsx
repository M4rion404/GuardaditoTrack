import React, { useState } from "react";
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
  // Cargar usuario desde localStorage
  const usuarioLocal = JSON.parse(localStorage.getItem("usuario")) || {};

  const [formData, setFormData] = useState({
    nombres: usuarioLocal.nombres || "",
    apellido_paterno: usuarioLocal.apellido_paterno || "",
    apellido_materno: usuarioLocal.apellido_materno || "",
    notificacion: usuarioLocal.notificacion || false,
    divisa: usuarioLocal.divisa || [], // arreglo de objetos { divisa, nombre }
    tipo_verificacion: usuarioLocal.tipo_verificacion || "",
  });

  const [hoverGuardar, setHoverGuardar] = useState(false);
  const [hoverCerrar, setHoverCerrar] = useState(false);
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

    setFormData((prev) => ({
      ...prev,
      divisa: nuevaListaDivisas,
    }));
  };

  const handleGuardar = async () => {
    setGuardando(true);

    // Refrescar usuarioLocal para asegurarnos de tener datos actualizados
    const usuarioLocalActual = JSON.parse(localStorage.getItem("usuario")) || {};

    const datosAEnviar = {};

    Object.keys(formData).forEach((key) => {
      const valorNuevo = formData[key];
      const valorViejo = usuarioLocalActual[key];

      if (
        (typeof valorNuevo === "string" && valorNuevo.trim() !== "" && JSON.stringify(valorNuevo) !== JSON.stringify(valorViejo)) ||
        (typeof valorNuevo === "boolean" && valorNuevo !== valorViejo) ||
        (Array.isArray(valorNuevo) && JSON.stringify(valorNuevo) !== JSON.stringify(valorViejo))
      ) {
        datosAEnviar[key] = valorNuevo;
      } else {
        datosAEnviar[key] = valorViejo;
      }
    });

    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${usuarioLocalActual._id}/ActualizarUsuario`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosAEnviar),
      });

      if (!res.ok) {
        throw new Error(`Error en la petición: ${res.statusText}`);
      }

      const data = await res.json();

      // Actualizar localStorage con los datos nuevos recibidos del servidor
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      Swal.fire({ icon:"success", title:"Usuario actualizado", text: "Los datos del usuario se han actualizado correctamente.", timer:1500, showConfirmButton: false });
      onClose();
    } catch (error) {
      Swal.fire({ title: "Lo sentimos, ha ocurrido un error", text: "Parece que la conexión con el servidor ha fallado", icon: "warning", timer:1500, confirmButtonText: false, cancelButtonText: false});
    }

    setGuardando(false);
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
          <legend>Divisa:</legend>
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

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
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
      </aside>
    </>
  );
};

export default VentanaConfiguracion;
