import React from 'react';
import { ArrowLeft, FileText, Shield, AlertCircle, Calendar } from 'lucide-react';
import './Terminos.css';

const TerminosServicio = () => {
  return (
    <div className="terminos-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-button" onClick={() => (window.location.href = "/home")}>
              <ArrowLeft className="back-icon" />
            </button>
            <h1 className="page-title">Términos de Servicio</h1>
          </div>
          <div className="header-right">
            <Calendar className="calendar-icon" />
            Última actualización: Enero 2025
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Introduction */}
        <div className="intro-section">
          <div className="intro-header">
            <div className="intro-icon">
              <FileText className="file-icon" />
            </div>
            <div className="intro-text">
              <h2 className="intro-title">Términos y Condiciones de Uso</h2>
              <p className="intro-subtitle">Gestor de Finanzas - Plataforma de Gestión Financiera</p>
            </div>
          </div>

          <div className="warning-banner">
            <div className="warning-content">
              <AlertCircle className="warning-icon" />
              <div className="warning-text">
                <p className="warning-message">
                  <strong>Importante:</strong> Al utilizar nuestros servicios, aceptas estos términos en su totalidad. 
                  Te recomendamos leer cuidadosamente este documento.
                </p>
              </div>
            </div>
          </div>

          <p className="intro-description">
            Estos Términos de Servicio ("Términos") rigen el uso de la plataforma de gestión financiera 
            proporcionada por nuestro servicio ("Gestor de Finanzas", "nosotros", "nuestro"). Al acceder 
            o utilizar nuestros servicios, usted ("Usuario", "usted") acepta estar sujeto a estos Términos.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="terms-sections">
          {/* Section 1 */}
          <div className="term-section">
            <h3 className="section-title">1. Aceptación de los Términos</h3>
            <div className="section-content">
              <p className="section-text">
                Al registrarse, acceder o utilizar cualquier parte de nuestros servicios, usted confirma que:
              </p>
              <ul className="section-list">
                <li>Ha leído, entendido y acepta estos Términos de Servicio</li>
                <li>Tiene al menos 18 años de edad o cuenta con autorización parental</li>
                <li>Tiene la capacidad legal para celebrar este acuerdo</li>
                <li>Proporcionará información veraz y actualizada</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="term-section">
            <h3 className="section-title">2. Descripción del Servicio</h3>
            <p className="section-text">
              Gestor de Finanzas es una plataforma digital que proporciona herramientas para:
            </p>
            <div className="service-grid">
              <div className="service-card personal">
                <h4 className="service-title">Gestión Personal</h4>
                <ul className="service-list">
                  <li>Control de gastos e ingresos</li>
                  <li>Creación de presupuestos</li>
                  <li>Análisis financiero personal</li>
                </ul>
              </div>
              <div className="service-card business">
                <h4 className="service-title">Gestión Empresarial</h4>
                <ul className="service-list">
                  <li>Contabilidad básica</li>
                  <li>Reportes financieros</li>
                  <li>Gestión de facturas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="term-section">
            <h3 className="section-title">3. Responsabilidades del Usuario</h3>
            <div className="responsibilities">
              <div className="responsibility-item">
                <h4 className="responsibility-title">Seguridad de la Cuenta</h4>
                <p className="responsibility-text">
                  Usted es responsable de mantener la confidencialidad de sus credenciales de acceso 
                  y de todas las actividades que ocurran bajo su cuenta.
                </p>
              </div>
              <div className="responsibility-item">
                <h4 className="responsibility-title">Uso Apropiado</h4>
                <p className="responsibility-text">
                  Se compromete a utilizar el servicio únicamente para fines legítimos y de acuerdo 
                  con todas las leyes aplicables.
                </p>
              </div>
              <div className="responsibility-item">
                <h4 className="responsibility-title">Veracidad de la Información</h4>
                <p className="responsibility-text">
                  Debe proporcionar información precisa y actualizada, especialmente datos financieros 
                  que afecten la funcionalidad del servicio.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="term-section">
            <div className="security-header">
              <Shield className="shield-icon" />
              <h3 className="section-title">4. Privacidad y Seguridad de Datos</h3>
            </div>
            <div className="section-content">
              <p className="section-text">
                Nos comprometemos a proteger su información personal y financiera mediante:
              </p>
              <div className="security-features">
                <ul className="security-list">
                  <li><strong>Encriptación:</strong> Todos los datos se transmiten y almacenan con encriptación de nivel bancario</li>
                  <li><strong>Acceso limitado:</strong> Solo personal autorizado puede acceder a sistemas críticos</li>
                  <li><strong>Auditorías:</strong> Realizamos auditorías de seguridad regulares</li>
                  <li><strong>Respaldo:</strong> Sus datos se respaldan de forma segura y regular</li>
                </ul>
              </div>
              <p className="section-text">
                Para más detalles, consulte nuestra Política de Privacidad.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="term-section">
            <h3 className="section-title">5. Limitaciones y Exención de Responsabilidad</h3>
            <div className="disclaimer-banner">
              <p className="disclaimer-text">
                <strong>Importante:</strong> Este servicio es una herramienta de gestión y no constituye 
                asesoría financiera profesional.
              </p>
            </div>
            <div className="limitations-list">
              <p>No somos responsables de decisiones financieras tomadas basándose en la información de la plataforma</p>
              <p>El servicio se proporciona "tal como está" sin garantías expresas o implícitas</p>
              <p>No garantizamos la disponibilidad ininterrumpida del servicio</p>
              <p>Recomendamos consultar con profesionales financieros para decisiones importantes</p>
            </div>
          </div>

         

          {/* Section 7 */}
          <div className="term-section">
            <h3 className="section-title">6. Terminación del Servicio</h3>
            <div className="termination-content">
              <div className="termination-item">
                <h4 className="termination-title">Por parte del Usuario</h4>
                <p className="termination-text">
                  Puede cancelar su cuenta en cualquier momento desde la configuración de su perfil 
                  o contactándonos directamente.
                </p>
              </div>
              <div className="termination-item">
                <h4 className="termination-title">Por nuestra parte</h4>
                <p className="termination-text">
                  Podemos suspender o terminar su cuenta si viola estos términos, con previo aviso 
                  cuando sea posible.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8 */}
          <div className="term-section">
            <h3 className="section-title">7. Modificaciones a los Términos</h3>
            <p className="section-text">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios importantes se comunicarán con al menos 30 días de anticipación.
            </p>
            <div className="modification-note">
              <p className="note-text">
                El uso continuado del servicio después de los cambios constituye su aceptación 
                de los nuevos términos.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="contact-section">
            <h3 className="contact-title">¿Preguntas sobre estos términos?</h3>
            <p className="contact-description">
              Si tiene alguna pregunta sobre estos Términos de Servicio, no dude en contactarnos.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>Email:</strong> legal@fintrack.com
              </div>
              <div className="contact-item">
                <strong>Teléfono:</strong> +1 (555) 123-4567
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <p className="footer-text">
            © 2025 Gestor de Finanzas. Todos los derechos reservados.
          </p>
        </div>
      </main>
    </div>
  );
};

export default TerminosServicio;