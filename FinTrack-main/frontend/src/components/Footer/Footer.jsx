// src/components/Footer/Footer.jsx
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-contenido">
        <p>¿Tienes dudas o sugerencias? Escríbenos a <a href="mailto:soporte@fintrack.com">soporte@fintrack.com</a></p>
        <p>© {new Date().getFullYear()} Fintrack. Todos los derechos reservados.</p>
        <p>Tu privacidad es importante para nosotros. Consulta nuestros términos y políticas.</p>
      </div>
    </footer>
  );
};

export default Footer;
