import React from 'react';
import './BarraNavegacion.css';
import { Link } from "react-router-dom";
import logoFintrack from "../../assets/FintrackBlanco.png";
import { User } from "react-feather"; // or your icon library

const BarraNavegacion = () => {
  return (
    <nav className="barra-navegacion">
      <div className="barra-navegacion-izquierda">
        <div className="logo">
          <img className="logo-fintrack" src={logoFintrack} alt="Logo Fintrack" />
        </div>
        <ul className="barra-navegacion-lista">
          <li><Link to="/presupuestos">Presupuestos</Link></li>
          <li><Link to="/transacciones">Transacciones</Link></li>
          <li><Link to="/metasH">Metas y ahorros</Link></li>
          <li><Link to="/SaludFinanciera">Salud Financiera</Link></li>
          <li><Link to="/categorias">Categorías</Link></li>
        </ul>
      </div>
      <div className="barra-navegacion-derecha">
        <User className="icono-usuario" />
        <span>Usuario-Fintrack</span>
      </div>
    </nav>
  );
};

export default BarraNavegacion;