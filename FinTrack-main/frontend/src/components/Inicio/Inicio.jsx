// src/components/Inicio/Inicio.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../Footer/Footer";

import logoFintrack from "../../assets/FintrackBlanco.png";
import seccionAzul from "../../assets/seccionazul.png";
import "./Inicio.css";

const HeroSection = ({ title, texts }) => (
  <section className="hero">
    <div className="hero-contenido" data-aos="fade-up">
      <h1 className="hero-titulo">{title}</h1>
      <div className="hero-textos">
        {texts.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
    </div>
  </section>
);

const InfoSection = ({ title, text, imageSrc, color = "azul" }) => (
  <section className={`seccion-${color}`}>
    <div className={`texto-${color}`} data-aos="fade-up">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
    <div className={`imagen-${color}`} data-aos="fade-up">
      <img src={imageSrc} alt="Ilustración" />
    </div>
  </section>
);

const Inicio = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const textoHero = [
    "Bienvenido a Fintrack",
    "La plataforma que te ayuda a tomar el control de tus finanzas personales.",
    "Aquí podrás planificar, visualizar y optimizar tus ingresos y gastos con facilidad."
  ];

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

      {/* Sección 1: Introducción */}
      <HeroSection
        title="FINTRACK"
        texts={textoHero}
      />

      {/* Sección 2: ¿Qué puedes hacer aquí? */}
      <InfoSection
        title="¿Qué puedes hacer aquí?"
        text="Desde registrar tus ingresos y gastos hasta crear presupuestos mensuales, fijar metas de ahorro, evaluar tu salud financiera y analizar tu comportamiento económico. Todo desde una interfaz intuitiva y poderosa."
        imageSrc={seccionAzul}
        color="azul"
      />

      {/* Sección 3: Más beneficios */}
      <InfoSection
        title="Beneficios de usar Fintrack"
        text="Obtén una visión clara de tu economía, toma mejores decisiones financieras, recibe sugerencias personalizadas y accede a reportes visuales que te ayudarán a mejorar tu bienestar financiero día a día."
        imageSrc={seccionAzul}
        color="roja"
      />

      {/* Sección 4: Contacto y derechos */}
      <InfoSection
        title="Contáctanos y más información"
        text="¿Tienes dudas, sugerencias o necesitas ayuda? Escríbenos a soporte@fintrack.com. Todos los derechos reservados © 2025 Fintrack. Tu privacidad es nuestra prioridad."
        imageSrc={seccionAzul}
        color="azul"
      />
      <Footer />
    </div>
  );
};

export default Inicio;