import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Historial.css";

const tipos = ["todos", "transaccion", "presupuesto", "categoria"];
const camposExcluidos = ["_id", "__v", "fecha", "createdAt", "updatedAt"];

const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [seleccionado, setSeleccionado] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    else setError("Usuario no encontrado.");
  }, []);

  useEffect(() => {
    if (userId) obtenerHistorial();
  }, [filtroTipo, userId]);

  const obtenerHistorial = async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        filtroTipo === "todos"
          ? `http://localhost:3000/api/historial/${userId}`
          : `http://localhost:3000/api/usuarios/${userId}?tipo=${filtroTipo}`;
      const { data } = await axios.get(url);
      console.log("Historial recibido:", data);
      setHistorial(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar historial:", err);
      setError("No se pudo cargar el historial.");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fechaIso) => new Date(fechaIso).toLocaleString();

  const mostrarCambios = (item) => {
    setSeleccionado(seleccionado?._id === item._id ? null : item);
  };

  const renderCambios = (item) => {
    const { accion, datos_antes, datos_despues } = item;

    const limpiar = (obj) =>
      Object.fromEntries(
        Object.entries(obj).filter(([k]) => !camposExcluidos.includes(k))
      );

    const antes = datos_antes ? limpiar(datos_antes) : {};
    const despues = datos_despues ? limpiar(datos_despues) : {};

    if (accion.includes("Actualizacion") && datos_antes && datos_despues) {
      const cambios = Object.keys(antes).filter(
        (key) => antes[key] !== despues[key]
      );

      return (
        <div style={{ marginBottom: "2rem" }}>
          <h5>Datos antes:</h5>
          <ul>
            {Object.entries(antes).map(([clave, valor]) => (
              <li key={clave}>
                <strong>{formatearCampo(clave)}:</strong> {valor}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "1rem" }} />

          <h5>Datos después:</h5>
          <ul>
            {Object.entries(despues).map(([clave, valor]) => (
              <li key={clave}>
                <strong>{formatearCampo(clave)}:</strong> {valor}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "1rem" }} />

          <h5>Cambios:</h5>
          {cambios.length > 0 ? (
            <ul className="cambios-lista">
              {cambios.map((clave) => (
                <li key={clave}>
                  <strong>{formatearCampo(clave)}</strong>: "{antes[clave]}" → "{despues[clave]}"
                </li>
              ))}
            </ul>
          ) : (
            <p>Sin cambios visibles.</p>
          )}
        </div>
      );
    }

    if (accion.includes("Eliminacion") && datos_antes) {
      return (
        <div>
          <h5>Datos eliminados:</h5>
          <ul>
            {Object.entries(antes).map(([k, v]) => (
              <li key={k}>
                <strong>{k}:</strong> {v}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (accion.includes("Creación") && datos_despues) {
      return (
        <div>
          <h5>Datos creados:</h5>
          <ul>
            {Object.entries(despues).map(([k, v]) => (
              <li key={k}>
                <strong>{k}:</strong> {v}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return <p>No hay detalles disponibles.</p>;
  };

  const formatearCampo = (campo) => {
  const traducciones = {
    titulo: "Título",
    descripcion: "Descripción",
    accion: "Acción",
    metodo_pago: "Método de pago",
    monto: "Monto",
    estado: "Estado",
    tipo: "Tipo",
    usuario: "Usuario",
    fecha: "Fecha",
  };

  return traducciones[campo] || campo.charAt(0).toUpperCase() + campo.slice(1);
};


  return (
    <div className="historial-container">
      <h2 className="historial-title">Historial de Actividades</h2>

      <div className="historial-filter">
        <label className="filtro-label">Filtrar por tipo:</label>
        <select
          className="filtro-select"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          {tipos.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="historial-loading">Cargando historial...</p>}
      {error && <p className="historial-error">{error}</p>}
      {!loading && historial.length === 0 && (
        <p className="historial-vacio">No hay acciones registradas.</p>
      )}

      <ul className="historial-lista">
        {historial.map((item) => (
          <li
            key={item._id}
            className="historial-item"
            onClick={() => mostrarCambios(item)}
          >
            <div>
              <p className="historial-accion">{item.accion}</p>
              <p className="historial-info">
                Por <strong>{item.usuario}</strong> el{" "}
                {formatearFecha(item.fecha)}
              </p>
            </div>
            <span className="historial-tipo">{item.tipo}</span>

            {seleccionado?._id === item._id && (
              <div className="historial-detalles">
                <h4>Detalles:</h4>
                {renderCambios(item)}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Historial;
