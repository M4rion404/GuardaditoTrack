import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Presupuestos.css";

const Presupuestos = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    monto_limite: "",
    monto_gastado: "",
  });

  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPresupuestos = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId")
  
    try {
      
      if (!token) {
        console.error("Token no encontrado en localStorage. Por favor, inicie sesión.");
        return;
      }
  
      const response = await fetch(`http://localhost:3000/api/presupuestos/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          console.error("Token inválido o expirado. Por favor, inicie sesión nuevamente.");
        }
        throw new Error(`Error al obtener los presupuestos. Código: ${response.status}`);
      }
  
      const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("La respuesta del servidor no es JSON");
    }
  
    const data = await response.json();
      setPresupuestos(data);
    } catch (err) {
      console.error("Error al obtener presupuestos:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    fetchPresupuestos(); // Solo llama si hay userId
  } else {
    console.error("No hay userId en localStorage. Redirige al login o espera a que el usuario inicie sesión.");
    setError("Debes iniciar sesión para ver tus presupuestos.");
  }
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

//_____________________________________________________________________________________________________________
const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // Redirigir a la página de inicio de sesión
};

//______________________________________________________________________________________________________________

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem("userId")

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado en localStorage. Por favor, inicie sesión.");
        return;
      }
      const response = await axios.post(
        `http://localhost:3000/api/presupuestos/${userId}`,
        formData, {headers: { Authorization: `Bearer ${token}` }}
      );
      console.log("Presupuesto creado:", response.data);
      //setPresupuestos((p) => [...p, response.data]);
      fetchPresupuestos();
      setFormData({
        titulo: "",
        descripcion: "",
        monto_limite: "",
        monto_gastado: "",
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updateData) => {
    setLoading(true);
    setError(null);
    const userId = localStorage.getItem("userId")

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado en localStorage. Por favor, inicie sesión.");
        return;
      }
      const response = await axios.put(
        `http://localhost:3000/api/presupuestos/${userId}/${id}`,
        updateData, {headers: { Authorization: `Bearer ${token}` }}
      );

      console.log("Presupuesto actualizado:", response.data);
      /* setPresupuestos((prev) =>
        prev.map((p) => (p._id === id ? response.data : p))
      ); */
      fetchPresupuestos();

      setFormData({
        titulo: "",
        descripcion: "",
        monto_limite: "",
        monto_gastado: "",
      });

      setPresupuestoSeleccionado(null);
      setError(null);
    } catch (err) {
      console.error("Error actualizando presupuesto: ", err);
      setError("Error al actualizar el presupuesto");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem("userId")

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado en localStorage. Por favor, inicie sesión.");
        return;
      }
      console.log("Eliminando presupuesto con ID:", id);
      const response = await axios.delete(
        `http://localhost:3000/api/presupuestos/${userId}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Presupuesto eliminado:", response.data);
      /* setPresupuestos((prev) => prev.filter((p) => p._id !== id)); */
      fetchPresupuestos();

      if (presupuestoSeleccionado?._id === id) {
        setFormData({
          titulo: "",
          descripcion: "",
          monto_limite: "",
          monto_gastado: "",
        });
      }

      setPresupuestoSeleccionado(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [mostrarTabla, setMostrarTabla] = useState(false);

  const handleRowClick = (presupuesto) => {
    setFormData({
      titulo: presupuesto.titulo,
      descripcion: presupuesto.descripcion,
      monto_limite: presupuesto.monto_limite,
      monto_gastado: presupuesto.monto_gastado,
    });
    setPresupuestoSeleccionado(presupuesto);
  };

  const handleRefresh = () => {
    fetchPresupuestos();
  };

  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);

  return (
    <div className="pantalla-dividida">
      <div className="mitad-superior">
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
        <h2>Crear Presupuesto</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            presupuestoSeleccionado
              ? handleUpdate(presupuestoSeleccionado._id, formData)
              : handleSubmit(e);
          }}
          className="presupuestos-form"
        >
          <div className="form-group">
            <label htmlFor="titulo">Titulo del Presupuesto:</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="monto_limite">Monto Limite:</label>
            <input
              type="number"
              id="monto_limite"
              name="monto_limite"
              value={formData.monto_limite}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="monto_gastado">Monto Gastado:</label>
            <input
              type="number"
              id="monto_gastado"
              name="monto_gastado"
              value={formData.monto_gastado}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="btn-submit-container">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading
              ? presupuestoSeleccionado
                ? "Actualizando..."
                : "Creando..."
              : presupuestoSeleccionado
              ? "Actualizar Presupuesto"
              : "Crear Presupuesto"}
          </button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </form>

        {/* Boton para mostrar la tabla de presupuestos */}
        <button
          onClick={() => setMostrarTabla(!mostrarTabla)}
          className="btn-toggle-table"
        >
          {mostrarTabla ? "Ocultar Presupuestos" : "Mostrar Presupuestos"}
        </button>
        </div>
        <div
          className={`mitad-inferior ${mostrarTabla ? "visible" : "oculto"}`}
        >
          <div className="presupuestos-info">
            <h2>Presupuestos Existentes</h2>

            {/* ############################################################################### */}
            {loading && <p>Cargando...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Mostrar la tabla de presupuestos si el estado mostrarTabla es verdadero */}
            {mostrarTabla && (
              <>
                <button onClick={handleRefresh} className="btn-refresh">
                  {loading ? "Refrescando..." : "Refrescar Tabla"}
                </button>
                <button
                  onClick={() => handleDelete(presupuestoSeleccionado._id)}
                  className="btn-delete"
                >
                  {loading ? "Eliminando..." : "Eliminar Presupuesto"}
                </button>

                {/*# Presupuestos Table */}
                <table className="presupuestos-table">
                  <thead>
                    <tr>
                      <th>Titulo</th>
                      <th>Descripción</th>
                      <th>Monto Limite</th>
                      <th>Monto Gastado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presupuestos.map((presupuesto) => (
                      <tr
                        key={presupuesto._id}
                        onClick={() => handleRowClick(presupuesto)}
                      >
                        <td>{presupuesto.titulo}</td>
                        <td>{presupuesto.descripcion}</td>
                        <td>{presupuesto.monto_limite}</td>
                        <td>{presupuesto.monto_gastado}</td>
                        <td>
                          {new Date(
                            presupuesto.fecha_creacion
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
  );
};

export default Presupuestos;
