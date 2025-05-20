import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import logoFintrack from '../../assets/QuickStart.png';
import './ConfiguracionRapida.css';

const ConfiguracionRapida = () => {
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState(false);
  const [divisas, setDivisas] = useState({ usd: false, mxn: false });
  const navigate = useNavigate();

  const handleMetodoVerficacion = (e) => {
    setMensaje(e.target.value);
  };

  const handleDivisaChange = (e) => {
    const { name, checked } = e.target;
    setDivisas(prev => ({ ...prev, [name]: checked }));
  };


  // Chambea cuando se detecta una actualización en divisa o mensaje (Hay un useState por)
  useEffect(() => {   
    console.log("Divisas actualizadas correctamente:", divisas);
  }, [divisas]);

  useEffect(() => {
    console.log("Método de verificación actualizado:", mensaje);
  }, [mensaje]);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
    if (usuarioGuardado) {
      const userData = JSON.parse(usuarioGuardado);
      setUsuario(userData);

      // Transformar tipo_divisa array -> objeto { usd: true/false, mxn: true/false }
      const divisasUsuario = {
        usd: userData.tipo_divisa?.some(d => d.divisa === "USD") || false,
        mxn: userData.tipo_divisa?.some(d => d.divisa === "MXN") || false,
      };
      setDivisas(divisasUsuario);

      setMensaje(userData.verificacion);
    }
  }, []);


  const guardarConfiguracion = async () => {
    if (!usuario || !usuario._id) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario no cargado correctamente",
      });
      return;
    }

    if (!mensaje) {
      Swal.fire({ icon: "error", title: "Método de verificación requerido", text: "Por favor selecciona un método de verificación (Email o SMS)." });
      return;
    }

    // Convertimos el objeto de divisas en un array de objetos
    const divisasSeleccionadas = [];

    if (divisas.usd) {
      divisasSeleccionadas.push({ divisa: "USD", nombre: "Dólar Americano" });
    }

    if (divisas.mxn) {
      divisasSeleccionadas.push({ divisa: "MXN", nombre: "Peso Mexicano" });
    }

    if (!divisas.usd && !divisas.mxn) {
    Swal.fire({
      icon: "error",
      title: "Divisa requerida",
      text: "Debes seleccionar al menos una divisa."
    });
    return;
  }

    const usuarioActualizado = {
      ...usuario,
      tipo_divisa: divisasSeleccionadas,
      verificacion: mensaje,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuario._id}/ConfiguracionRapida`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo_divisa: divisasSeleccionadas,
          verificacion: mensaje,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem("usuarioRegistrado", JSON.stringify(updatedUser));
        Swal.fire({ icon: "success", title: "Preferencias", text: "Las preferencias de la cuenta se han establecido correctamente.", timer: 1500, showConfirmButton: false });
        setUsuario(updatedUser);
        navigate("/Login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al guardar configuración",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al conectar con el servidor",
      });

    }
  };


  if (!usuario) return <p>Cargando usuario...</p>;



  return (
    <div className='contenedor-principal'>

      <div className="panel-izquierdo">
        <div className="contenido-principal">
          <h1 className="titulo-principal">Preferencias de la cuenta</h1>
          <h3 className="subtitulo">Configuración rápida</h3>

          <div className='grupo-opciones-horizontal'>

            <div className="seccion-configuracion bloque-opciones">
              <label><strong>Selecciona tu método de verificación</strong></label>
              <div className="opciones-horizontal">
                <label><input type="radio" value="email" checked={mensaje === 'email'} onChange={handleMetodoVerficacion} /> Email</label>
                <label><input type="radio" value="sms" checked={mensaje === 'sms'} onChange={handleMetodoVerficacion} /> SMS</label>
              </div>
            </div>

            <div className="seccion-configuracion bloque-opciones">
              <label><strong>Selecciona la o las divisas </strong></label>
              <div className="opciones-horizontal">
                <label><input type="checkbox" name="usd" checked={divisas.usd} onChange={handleDivisaChange} /> USD</label>
                <label><input type="checkbox" name="mxn" checked={divisas.mxn} onChange={handleDivisaChange} /> MXN</label>
              </div>
            </div>

          </div>

          <button className="boton" onClick={guardarConfiguracion}>Continuar</button>
        </div>
      </div>

      <div className="panel-derecho">
        <div className="img-logo-fintrack">
          <img src={logoFintrack} alt="Logo Fintrack" />
        </div>

        <div className='descripcion-principal-contenedor'>
          <p className="descripcion-principal">
            Selecciona el método de autenticación que prefieras y monedas que usarás en FinTrack.<br /> <br /><b>Puedes cambiarlas luego en la configuración.</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionRapida;