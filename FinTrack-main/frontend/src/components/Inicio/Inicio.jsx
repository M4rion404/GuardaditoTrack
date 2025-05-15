// src/components/Inicio/Inicio.jsx
import React, { useEffect } from "react";
import logoFintrack from "../../assets/FintrackBlanco.png";
import seccionAzul from "../../assets/seccionazul.png";
import "./Inicio.css";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Inicio = () => {
  console.log("Inicio cargado");
  useEffect(() => {
  const handleScroll = () => {
    document.querySelectorAll(".hero-imagen, .imagen-azul, .scroll-anim").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add("visible");
      }
    });
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  return (
    <div className="contenedor-inicio">
      {/* Navegación */}
      <nav className="barra-navegacion">
        <div className="barra-navegacion-izquierda">
          <div className="logo">
            <img className="logo-fintrack" src={logoFintrack} alt="Logo Fintrack" />
          </div>
          <ul className="barra-navegacion-lista">
            <li><Link to="/presupuestos">Presupuestos</Link></li>
            <li><Link to="/transacciones">Transacciones</Link></li>
            <li><Link to="/metasH">Metas y ahorros</Link></li>
            <li><Link to="/saludF">Salud Financiera</Link></li>
            <li><Link to="/categorias">Categorías</Link></li>
          </ul>
        </div>
        <div className="barra-navegacion-derecha">
          <FaUser className="icono-usuario" />
          <span>Usuario-Fintrack</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-imagen">
          <img src={seccionAzul} alt="Imagen representativa" />
        </div>
        <div className="hero-texto">
          <h1>FINTRACK</h1>
          <p>Tu página web de Finanzas Personales</p>
          <p>Gestiona tus finanzas con eficiencia y claridad.</p>
          <p>Presupuestos, transacciones, metas de ahorro y salud financiera en un solo lugar.</p>
        </div>
      </section>

      {/* Sección azul */}
      <section className="seccion-azul">
        <div className="texto-azul">
          <h2>¿Qué puedes hacer aquí?</h2>
          <p>
            Administra tu dinero con facilidad. Crea presupuestos,
            registra transacciones, fija metas de ahorro y mejora tu salud financiera.
          </p>
        </div>

        <div className="imagen-azul">
          <img src={seccionAzul} alt="Finanzas organizadas" />
        </div>
      </section>

         {/* Sección Roja */}
      <section className="seccion-roja">
        <div className="texto-rojo">
          <h2>¿Qué chucha podemos hacer aqui hacer aquí?</h2>
          <p>
            BLAH BLAH BALH BLAH BLAH BLAH BLAH BLAH BLAH BLAH
          </p>
        </div>

        <div className="imagen-ROJA">
          <img src={seccionAzul} alt="Finanzas organizadas" />
        </div>
      </section>

      {/* Sección Testimonios */}
<section className="seccion-testimonios scroll-anim">
  <div className="texto-testimonios">
    <h2>Testimonios de nuestros usuarios</h2>
    <p>"Fintrack me ayudó a organizar mis finanzas como nunca antes." - Ana G.</p>
    <p>"Gracias a Fintrack, logré ahorrar para mi primer auto." - Luis P.</p>
    <p>"Muy fácil de usar y con todo lo que necesito." - Carla R.</p>
  </div>
</section>

{/* Sección Contacto */}
<section className="seccion-contacto scroll-anim">
  <div className="contenido-contacto">
    <h2>Contáctanos</h2>
    <p>¿Tienes preguntas o sugerencias? ¡Escríbenos!</p>
    <form className="formulario-contacto">
      <input type="text" placeholder="Tu nombre" required />
      <input type="email" placeholder="Tu correo electrónico" required />
      <textarea placeholder="Tu mensaje" rows="5" required></textarea>
      <button type="submit">Enviar</button>
    </form>
  </div>
</section>

    </div>
  );
};

export default Inicio;

