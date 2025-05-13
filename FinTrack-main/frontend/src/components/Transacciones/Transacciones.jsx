import React, { useState, useEffect } from "react";
import axios from "axios";


const Transacciones = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    accion: "Retiro",
    metodo_pago: "Efectivo",
    monto: "",
    estado: "En proceso",
  });


  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState(null);


  const fetchTransacciones = async () => {
    setLoading(true);
    setError(null);


    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")


    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${userId}/transacciones`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error("Error al obtener las transacciones");
      }


      const data = await response.json();
      setTransacciones(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    fetchTransacciones(); // Solo llama si hay userId
  } else {
    console.error("No hay userId en localStorage. Redirige al login o espera a que el usuario inicie sesión.");
    setError("Debes iniciar sesión para ver tus transacciones.");
  }
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);


    const userId = localStorage.getItem("userId");
    console.log("UserId obtenido: ", userId)


    if(!userId){
      console.error("Error: No se encontro el ID del usuario")
      return
    }


    const token = localStorage.getItem("token");


    try {
      const response = await axios.post(
        `http://localhost:3000/api/usuarios/${userId}/transacciones`,
        formData,{
          headers:{
            Authorization: `Bearer ${token}`,
          }
        }
      );
      console.log("Transaccion Registrada:", response.data);
      //setTransacciones((p) => [...p, response.data]);
      fetchTransacciones();
      setFormData({
        titulo: "",
        descripcion: "",
        accion: "Retiro",
        metodo_pago: "Efectivo",
        monto: "",
        estado: "En proceso",
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


    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")


    try {
      const response = await axios.put(
        `http://localhost:3000/api/usuarios/${userId}/transacciones/${id}`,
        updateData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      console.log("Transaccion actualizada:", response.data);
      /* setTransacciones((prev) =>
        prev.map((p) => (p._id === id ? response.data : p))
      ); */
      fetchTransacciones();


      setFormData({
        titulo: "",
        descripcion: "",
        accion: "Retiro",
        metodo_pago: "Efectivo",
        monto: "",
        estado: "En proceso",
      });


      setTransaccionSeleccionada(null);
      setError(null);
    } catch (err) {
      console.error("Error actualizando transaccion: ", err);
      console.error("Respuesta del servidor", err.response?.data)
      setError("Error al actualizar la transaccion");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);


    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")


    try {
      console.log("Eliminando transaccion con ID:", id);
      const response = await axios.delete(
        `http://localhost:3000/api/usuarios/${userId}/transacciones/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      console.log("Presupuesto eliminado:", response.data);
      /* setTransacciones((prev) => prev.filter((p) => p._id !== id)); */
      fetchTransacciones();


      if (transaccionSeleccionada?._id === id) {
        setFormData({
          titulo: "",
          descripcion: "",
          accion: "Retiro",
          metodo_pago: "Efectivo",
          monto: "",
          estado: "En proceso",
        });
      }


      setTransaccionSeleccionada(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleRowClick = (transaccion) => {
    setFormData({
      titulo: transaccion.titulo,
      descripcion: transaccion.descripcion,
      accion: transaccion.accion,
      metodo_pago: transaccion.metodo_pago,
      monto: transaccion.monto,
      estado: transaccion.estado,
    });
    setTransaccionSeleccionada(transaccion);
  };


  const handleRefresh = () => {
    fetchTransacciones();
  };


  return (
    <div className="transacciones-container" style={{maxHeight: "100vh", overflowY: "auto"}}>
      <h1>Transacciones</h1>
      <form className="transacciones-form"
      onSubmit={(e) => {
        e.preventDefault();
        transaccionSeleccionada
          ? handleUpdate(transaccionSeleccionada._id, formData)
          : handleSubmit(e);
      }}
      >
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={formData.titulo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
        />
        <select
          name="accion"
          value={formData.accion}
          onChange={handleChange}
          required
        >
         
          <option value="Retiro">Retiro</option>
          <option value="Ingreso">Ingreso</option>
        </select>
        <select
          name="metodo_pago"
          value={formData.metodo_pago}
          onChange={handleChange}
          required
        >
            <option value="">Seleccionar metodo de pago</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta de crédito">Tarjeta de crédito</option>
            <option value="Tarjeta de Debito">Tarjeta de Debito</option>
            <option value="Pago Móvil">Pago Móvil</option>
            <option value="PayPal">PayPal</option>
            <option value="Criptomonedas">Criptomonedas</option>
            <option value="Pago con código QR">Pago con código QR</option>
            <option value="Transferencia">Transferencia</option>


            </select>
        <input
          type="number"
          name="monto"
          placeholder="Monto"
          value={formData.monto}
          onChange={handleChange}
          required
        />
        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        >
          <option value="En proceso">En Proceso</option>
          <option value="Completado">Completado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
        <button type="submit" className="btn-submit-trnsaccion" disabled={loading}>
          {loading
            ? transaccionSeleccionada
              ? "Actualizando..."
              : "Creando..."
            : transaccionSeleccionada
            ? "Actualizar Transaccion"
            : "Registrar Transaccion"}
        </button>


        {error && <p className="error-message-transacciones">{error}</p>}
      </form>


      {/* Botón para mostrar la tabla de transacciones */}
        <button
        onClick={() => setMostrarTabla(!mostrarTabla)}
        className="btn-toggle-table-transacciones"
        >
          {mostrarTabla ? "Ocultar Tabla" : "Mostrar Tabla"}
        </button>


      {/* ############################################################################### */}
      {loading && <p>Cargando...</p>}
      {error && <p className="error-message">Error: {error}</p>}


      {/* Mostrar la tabla */}
      {mostrarTabla && (
        <>
          <button onClick={handleRefresh} className="btn-refresh-transacciones">
            {loading ? "Refrescando..." : "Refrescar Tabla"}
          </button>


          <button
            onClick={() => handleDelete(transaccionSeleccionada._id)}
            className="btn-delete-transaccion"
          >
            {loading ? "Eliminando..." : "Eliminar Transacción"}
          </button>


          {/*# Transacciones Table */}
          <table border="1" className="transacciones-table">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Descripción</th>
                <th>Accion</th>
                <th>Método de Pago</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {transacciones.map((transaccion) => (
                <tr
                  key={transaccion._id}
                  onClick={() => handleRowClick(transaccion)}
                >
                  <td>{transaccion.titulo}</td>
                  <td>{transaccion.descripcion}</td>
                  <td>{transaccion.accion}</td>
                  <td>{transaccion.metodo_pago}</td>
                  <td>{transaccion.monto}</td>
                  <td>{transaccion.estado}</td>
                  <td>{new Date(transaccion.fecha).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};


export default Transacciones;