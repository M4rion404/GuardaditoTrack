import React from "react";
import logoFintrack from '../../assets/FintrackBlanco.png'
import "./Inicio.css";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";


const Inicio = () => {
  
  return (
    <div className="contenedor-inicio">
      <nav className="barra-navegacion">
        <div className="barra-navegacion-izquierda">
          <div className="logo">
            <img className="logo-fintrack" src={logoFintrack} alt="Logo Fintrack" />
          </div>
          <ul className="barra-navegacion-lista">
            <li>
              <Link to="/presupuestos" className="boton-Presupuestos">
              Presupuestos
              </Link>
            </li>
            <li><Link to="/transacciones" className="boton-Transacciones">
              Transacciones
              </Link>
            </li>
            <li><Link to="/metasH" className="boton-Metas">
              Metas y ahorros
              </Link>
            </li>
            <li><Link to="/saludF" className="boton-Salud">
              Salud Financiera
              </Link>
            </li>
            <li>
              <Link to="/categorias" className="boton-categoria">
              Categorías
              </Link>
            </li>
          </ul>
          
        </div>
        <div className="barra-navegacion-derecha">
          <FaUser/>
          <span>Usuario-Fintrack</span>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-imagen">Imagen</div>
        <div className="hero-texto">
          <h1>FINTRACK</h1>
          <p>Tu pagina web de Finanzas Personales</p>
          <p>Más descripción</p>
        </div>
      </section>

      <section className="seccion-azul">
        <div className="texto-azul">
          <h2>Crea presupuestos de manera rápida</h2>
          <p>Con FINTRACK crear presupuestos...</p>
        </div>
        <div className="imagen-azul">Imagen</div>
      </section>
    </div>
  );
};

export default Inicio;