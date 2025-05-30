import React from 'react';
import { ArrowLeft, Users, Target, Award, TrendingUp } from 'lucide-react';
import './Acerca.css';

const SobreNosotros = () => {
  return (
    <div className="sobre-nosotros-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left" onClick={() => (window.location.href = "/home")}>
            <button className="back-button">
              <ArrowLeft className="back-icon" />
            </button>
            <h1 className="page-title">Sobre Nosotros</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <div className="resumen">
          <div className="resumen-icon">
            <TrendingUp className="trending-icon" />
          </div>
          <h2 className="resumen-titulo">
            Tu Socio en el Éxito Financiero
          </h2>
          <p className="resumen-descripcion">
            Desarrollamos soluciones innovadoras para ayudarte a tomar control total de tus finanzas 
            personales y empresariales con herramientas inteligentes y fáciles de usar.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="mission-vision-grid">
          <div className="card mission-card">
            <div className="card-header">
              <div className="card-icon mission-icon">
                <Target className="icon" />
              </div>
              <h3 className="card-title">Nuestra Misión</h3>
            </div>
            <p className="card-text">
              Democratizar el acceso a herramientas financieras profesionales, proporcionando 
              una plataforma intuitiva que permita a individuos y empresas gestionar sus recursos 
              de manera eficiente, tomar decisiones informadas y alcanzar sus objetivos financieros.
            </p>
          </div>

          <div className="card vision-card">
            <div className="card-header">
              <div className="card-icon vision-icon">
                <Award className="icon" />
              </div>
              <h3 className="card-title">Nuestra Visión</h3>
            </div>
            <p className="card-text">
              Ser la plataforma líder en gestión financiera personal y empresarial, reconocida 
              por su innovación, seguridad y capacidad de transformar la manera en que las personas 
              se relacionan con sus finanzas en el mundo digital.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="values-section">
          <div className="values-header">
            <h3 className="values-title">Nuestros Valores</h3>
            <p className="values-subtitle">
              Los principios que guían cada decisión y caracterizan nuestra forma de trabajar
            </p>
          </div>

          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon security-icon">
                <span className="emoji">🔒</span>
              </div>
              <h4 className="value-title">Seguridad</h4>
              <p className="value-description">
                Protegemos tus datos financieros con los más altos estándares de seguridad 
                y encriptación de nivel bancario.
              </p>
            </div>

            <div className="value-item">
              <div className="value-icon simplicity-icon">
                <span className="emoji">⚡</span>
              </div>
              <h4 className="value-title">Simplicidad</h4>
              <p className="value-description">
                Creemos que las herramientas financieras deben ser potentes pero fáciles 
                de usar para todos los usuarios.
              </p>
            </div>

            <div className="value-item">
              <div className="value-icon innovation-icon">
                <span className="emoji">🚀</span>
              </div>
              <h4 className="value-title">Innovación</h4>
              <p className="value-description">
                Constantemente mejoramos y añadimos nuevas funcionalidades basadas 
                en las necesidades de nuestros usuarios.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <div className="team-content">
            <div className="team-icon">
              <Users className="users-icon" />
            </div>
            <h3 className="team-title">Nuestro Equipo</h3>
            <p className="team-description">
              Somos un equipo apasionado de desarrolladores, diseñadores y expertos financieros 
              comprometidos con crear la mejor experiencia de gestión financiera posible.
            </p>
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">15+</div>
                <div className="stat-label">Desarrolladores</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5+</div>
                <div className="stat-label">Años de Experiencia</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10k+</div>
                <div className="stat-label">Usuarios Activos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="contact-section">
          <h3 className="contact-title">¿Tienes alguna pregunta?</h3>
          <p className="contact-description">
            Nos encantaría escucharte. Contáctanos para saber más sobre nuestros servicios 
            o para obtener soporte técnico.
          </p>
          <button className="contact-button">
            Contáctanos
          </button>
        </div>
      </main>
    </div>
  );
};

export default SobreNosotros;