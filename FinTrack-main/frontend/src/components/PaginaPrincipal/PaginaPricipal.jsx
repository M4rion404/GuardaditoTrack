import React from 'react';
import { Link } from "react-router-dom";
//import { motion } from 'framer-motion';
import { FaChevronRight, FaUserPlus } from 'react-icons/fa';
//import { RiInformation2Fill } from "react-icons/ri";
//import Leon from '../../assets/Leon.jpg';
import logoFintrack from '../../assets/FintrackBlanco.png'
import '../PaginaPrincipal/PaginaPrincipal.css'

const PaginaPrincipal = () => {
    return (
      <div className='contenedor-principal'>

        <div className="panel-izquierdo">
          <div className="contenido-principal">
            <h1 className="titulo-principal">
              <span className="light">Bienvenido a </span> 
              <br/>
              FinTrack
            </h1>
          </div>  

          <div className='grupo-botones'>
            <Link to="/Login" className="boton">Iniciar sesión<FaChevronRight className='icono'/> </Link>
            <Link to="/SignUp" className="boton">Registrarse<FaUserPlus className='icono'/></Link>
          </div>
          
        </div>

        <div className="panel-derecho-inicio">            
          <div className="img-logo-fintrack">
            <img src={logoFintrack} alt="Logo"/>  
          </div>
          
          <div className='descripcion-principal-contenedor'>
            <p className="descripcion-principal">
                Una plataforma para gestionar tus finanzas personales, crear metas de ahorro y aprender
                sobre administración financiera.              
            </p>
          </div>
        </div>
      </div>      
    );
  };

export default PaginaPrincipal;
