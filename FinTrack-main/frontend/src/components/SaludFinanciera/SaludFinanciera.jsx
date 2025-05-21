import React, { useState } from 'react';
import './SaludFinanciera.css';
//import BarraNavegacion from '../BarraNavegacion/BarraNavegacion';
import SaludF from '../../assets/SaludF.png'

const SaludFinanciera = () => {
  const [activeTab, setActiveTab] = useState('what-is');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="financial-health-container">
      {/* Barra de navegación en la parte superior */}
      

      {/* Botón de regresar */}
      <div className="brine-header">
         <button
            onClick={() => (window.location.href = "/home")}
            style={{
              zIndex: 9999,
              position: "relative",
              pointerEvents: "auto",
              cursor: "pointer",
            }}
          >
            &larr; Regresar
          </button>
      </div>

      {/* Encabezado */}
      <div className="financial-health-header">
        <h1>Salud Financiera</h1>
        <p className="subtitle">Conoce cómo mejorar tu relación con el dinero</p>
      </div>

      {/* Pestañas */}
      <div className="financial-health-tabs">
        <button 
          className={`tab-button ${activeTab === 'what-is' ? 'active' : ''}`}
          onClick={() => handleTabChange('what-is')}
        >
          ¿Qué es?
        </button>
        <button 
          className={`tab-button ${activeTab === 'pillars' ? 'active' : ''}`}
          onClick={() => handleTabChange('pillars')}
        >
          Pilares
        </button>
        <button 
          className={`tab-button ${activeTab === 'tips' ? 'active' : ''}`}
          onClick={() => handleTabChange('tips')}
        >
          Consejos
        </button>
        <button 
          className={`tab-button ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => handleTabChange('tools')}
        >
          Herramientas
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      <div className="financial-health-content">
        {activeTab === 'what-is' && (
          <div className="content-section">
            <h2>¿Qué es la Salud Financiera?</h2>
            <div className="content-with-image">
              <div className="text-content">
                <p>La salud financiera es el estado que refleja tu capacidad para gestionar tus finanzas de manera eficiente, enfrentar imprevistos económicos y alcanzar tus metas financieras a largo plazo.</p>
                <p>Una buena salud financiera te permite:</p>
                <ul>
                  <li>Tener control de tus ingresos y gastos diarios</li>
                  <li>Mantener un nivel de deuda manejable</li>
                  <li>Contar con ahorros para emergencias</li>
                  <li>Planificar para el futuro</li>
                </ul>
                <p>Al igual que la salud física, la salud financiera requiere atención, cuidados constantes y hábitos saludables para mantenerse en buen estado.</p>
              </div>
              <div className="image-container">
                <img
                  src={SaludF}
                  alt="Concepto de Salud Financiera"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pillars' && (
          <div className="content-section">
            <h2>Los 5 Pilares de la Salud Financiera</h2>
            <div className="pillar-container">
              <div className="pillar-card">
                <div className="pillar-icon">1</div>
                <h3>Presupuesto</h3>
                <p>Lleva un control detallado de tus ingresos y gastos para optimizar el uso de tu dinero.</p>
              </div>
              <div className="pillar-card">
                <div className="pillar-icon">2</div>
                <h3>Ahorro</h3>
                <p>Destina regularmente una parte de tus ingresos para necesidades futuras.</p>
              </div>
              <div className="pillar-card">
                <div className="pillar-icon">3</div>
                <h3>Manejo de Deuda</h3>
                <p>Administra tus compromisos financieros de forma responsable para evitar sobreendeudamiento.</p>
              </div>
              <div className="pillar-card">
                <div className="pillar-icon">4</div>
                <h3>Fondo de Emergencia</h3>
                <p>Cuenta con un respaldo económico para imprevistos equivalente a 3-6 meses de gastos.</p>
              </div>
              <div className="pillar-card">
                <div className="pillar-icon">5</div>
                <h3>Objetivos Financieros</h3>
                <p>Establece metas claras a corto, mediano y largo plazo para guiar tus decisiones financieras.</p>
              </div>
            </div>
            <div className="pillar-description">
              <p>Estos cinco pilares son fundamentales para construir una base sólida que te permita tener tranquilidad financiera y alcanzar tus metas.</p>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="content-section">
            <h2>Consejos para mejorar tu Salud Financiera</h2>
            <div className="tips-container">
              <div className="tip-card">
                <h3>Utiliza la regla 50/30/20</h3>
                <p>Distribuye tus ingresos de la siguiente manera: 50% para necesidades básicas, 30% para deseos personales y 20% para ahorro e inversión.</p>
              </div>
              <div className="tip-card">
                <h3>Automatiza tus ahorros</h3>
                <p>Programa transferencias automáticas a una cuenta de ahorro cada vez que recibas tus ingresos.</p>
              </div>
              <div className="tip-card">
                <h3>Elimina deudas de alto interés</h3>
                <p>Prioriza el pago de tarjetas de crédito y préstamos con altas tasas de interés para reducir el costo financiero.</p>
              </div>
              <div className="tip-card">
                <h3>Revisa y ajusta periódicamente</h3>
                <p>Analiza mensualmente tus finanzas para identificar áreas de mejora y realizar ajustes necesarios.</p>
              </div>
              <div className="tip-card">
                <h3>Edúcate constantemente</h3>
                <p>Invierte tiempo en aprender sobre finanzas personales para tomar decisiones más inteligentes.</p>
              </div>
              <div className="tip-card">
                <h3>Diversifica tus ingresos</h3>
                <p>Busca fuentes adicionales de ingresos para fortalecer tu economía y acelerar el cumplimiento de tus metas.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="content-section">
            <h2>HERRAMIENTAS PARA TU SALUD FINANCIERA</h2>
            <div className="tools-container">
              <div className="tool-card">
                <div className="tool-icon budget-icon">💰</div>
                <h3>Centro de Analisis del Banco de México</h3>
                <p>Obten información sobre como se analizan los fondos con ayuda del banco nacional.</p>
                <a href="https://www.banxico.org.mx/PortalTranspCompSistFin/" target="_blank" rel="noopener noreferrer" className="tool-btn">Descargar</a>
              </div>
              <div className="tool-card">
                <div className="tool-icon calculator-icon">🧮</div>
                <h3>Calculadora de Ahorro</h3>
                <p>Planifica tus metas de ahorro y visualiza tu progreso con esta herramienta interactiva.</p>
                <a href="https://www.finect.com/pildoras/salud-financiera" target="_blank" rel="noopener noreferrer" className="tool-btn">Usar calculadora</a>
              </div>
              <div className="tool-card">
                <div className="tool-icon debt-icon">📉</div>
                <h3>Plan de Reducción de Deudas</h3>
                <p>Genera un plan personalizado para eliminar tus deudas de manera eficiente.</p>
                <a href="https://finantah.com/2024/07/05/la-salud-financiera-clave-para-una-vida-estable-y-sostenible/" target="_blank" rel="noopener noreferrer" className="tool-btn">Crear plan</a>
              </div>
              <div className="tool-card">
                <div className="tool-icon goals-icon">🎯</div>
                <h3>Planificador de Metas</h3>
                <p>Define y da seguimiento a tus objetivos financieros a corto, mediano y largo plazo.</p>
                <a href="https://bettermoneyhabits.bankofamerica.com/es/saving-budgeting/setting-and-achieving-financial-goals" target="_blank" rel="noopener noreferrer" className="tool-btn">Comenzar</a>
              </div>
            </div>
            <div className="tools-additional">
              <h3>Recursos adicionales</h3>
              <div className="resources-list">
                <a href="https://promotores.profeco.gob.mx/pdf/Meducativo/Guia_de_educacion_financiera.pdf" target="_blank" rel="noopener noreferrer" className="resource-link">Guía completa de educación financiera</a>
                <a href="https://www.youtube.com/watch?v=9d23JhSbRpw" target="_blank" rel="noopener noreferrer" className="resource-link">Webinars sobre inversiones</a>
                <a href="https://fundacioncarlosslim.org/descubre-el-mundo-de-las-finanzas-con-el-curso-gratuito-finanzas-para-no-financieros/" target="_blank" rel="noopener noreferrer" className="resource-link">Curso de finanzas para principiantes</a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pie de página */}
      <div className="financial-health-footer">
        <p>Recuerda que mejorar tu salud financiera es un proceso gradual. Comienza con pequeños cambios y mantén la consistencia.</p>
      </div>
    </div>
  );
};

export default SaludFinanciera;
