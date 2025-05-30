import {
  PieChart,
  BarChart,
  Calendar,
  TrendingUp,
  Target,
  CreditCard,
  Shield,
  Award,
  User,
} from "lucide-react";
import "./Inicio.css";
import ColorHoverEffect from "../HoverEffect/ColorHoverEffect";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import { Bell } from 'lucide-react';
import logoFintrack from "../../assets/FintrackBlanco.png";
import VentanaConfiguracion from "../VentanaConfiguracion/VentanaConfiguracion";
import "./Inicio.css";
import PerroMelon from "../../assets/perro-melon.png";
import Leon from "../../assets/Leon.jpg";
import BillsPirata from "../../assets/billspirata.png"
import { Power } from "lucide-react";





const Inicio = () => {
  const [usuario, setUsuario] = useState(null);
  const [mostrarVentana, setMostrarVentana] = useState(false);
  const navigate = useNavigate();

// Función para cerrar sesión
const handleCerrarSesion = () => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Se cerrará tu sesión actual",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, cerrar sesión",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      // Limpiar localStorage
      localStorage.removeItem("usuario");
      localStorage.clear();
      
      // Navegar a la página de inicio
      navigate("/");
    }
  });
};

const handleNotificaciones = () => {
  Swal.fire({
    title: "Notificaciones",
    html: `
      <div style="text-align: left; max-height: 300px; overflow-y: auto;">
        <div style="padding: 10px; border-bottom: 1px solid #eee; margin-bottom: 10px;">
          <strong>Nueva transacción registrada</strong>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">Se ha registrado un nuevo ingreso por $500.00</p>
          <small style="color: #999;">Hace 2 horas</small>
        </div>
        <div style="padding: 10px; border-bottom: 1px solid #eee; margin-bottom: 10px;">
          <strong>Recordatorio de presupuesto</strong>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">Has alcanzado el 80% de tu presupuesto mensual</p>
          <small style="color: #999;">Hace 1 día</small>
        </div>
        <div style="padding: 10px; border-bottom: 1px solid #eee; margin-bottom: 10px;">
          <strong>Meta alcanzada</strong>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">¡Felicidades! Has alcanzado tu meta de ahorro</p>
          <small style="color: #999;">Hace 3 días</small>
        </div>
        <div style="padding: 10px;">
          <strong>Bienvenido a Fintrack</strong>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">Gracias por unirte a nuestra plataforma</p>
          <small style="color: #999;">Hace 1 semana</small>
        </div>
      </div>
    `,
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Marcar como leídas",
    cancelButtonText: "Cerrar",
    confirmButtonColor: "#007AFF",
    cancelButtonColor: "#6c757d",
    width: '500px',
    customClass: {
      popup: 'notificaciones-popup'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Aquí puedes agregar la lógica para marcar notificaciones como leídas
      Swal.fire({
        title: "¡Listo!",
        text: "Todas las notificaciones han sido marcadas como leídas",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      
      // Aquí podrías actualizar el estado de notificaciones
      // setNotificacionesNoLeidas(0);
    }
  });
};


  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (usuarioGuardado) {
        const usuarioObj = JSON.parse(usuarioGuardado);
        setUsuario(usuarioObj);
      }
    } catch (error) {
      console.error("Error al cargar usuario:", error);
    }
  }, []);

  const actualizarUsuario = () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (usuarioGuardado) {
        const usuarioObj = JSON.parse(usuarioGuardado);
        setUsuario(usuarioObj);
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const handleCerrarVentana = () => {
    setMostrarVentana(false);
    actualizarUsuario(); 
  };
  return (
    <div className="fintrack-homepage">
      {/* Navegación */}
        <nav className="barra-navegacion">
          <div className="barra-navegacion-izquierda">
            <div className="logo">
          <img
            className="logo-fintrack"
            src={logoFintrack}
            alt="Logo Fintrack"
          />
            </div>
            <ul className="barra-navegacion-lista">
          <li>
            <Link to="/presupuestos">Presupuestos</Link>
          </li>
          <li>
            <Link to="/metasAhorro">Metas y ahorros</Link>
          </li>
          <li>
            <Link to="/categorias">Categorías</Link>
          </li>
          <li>
            <Link to="/transacciones">Transacciones</Link>
          </li>
          
          <li>
            <Link to="/saludFinanciera">Salud Financiera</Link>
          </li>
          
            </ul>
          </div>
          <div className="barra-navegacion-derecha">
            <FaUser className="icono-usuario" />
            <span>{usuario?.nombres || usuario?.email || "Usuario-Fintrack"}</span>
            
            {/* Botón de notificaciones */}
            <Bell
              className="icono-notificaciones"
              onClick={handleNotificaciones}
              title="Notificaciones"
              style={{ 
                cursor: "pointer", 
                marginLeft: "15px",
                color: "#007AFF", // Azul para notificaciones
                fontSize: "1.2rem"
              }}
            />
            
            <Power
              className="icono-cerrar-sesion"
              onClick={handleCerrarSesion}
              title="Cerrar sesión"
              style={{ 
                cursor: "pointer", 
                marginLeft: "15px", 
                color: "#FF3B30", // Rojo típico de botón de apagado/encendido
                fontSize: "1.2rem"
              }}
            />
          </div>
        </nav>
        <ColorHoverEffect />

        {/* Hero Section */}
      <section className="hero-section bg-gradient-to-b from-cyan-500 to-blue-600 text-white py-20">
        <div className="mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Toma el control de tus finanzas personales
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Fintrack te ayuda a planificar, visualizar y optimizar tus ingresos
            y gastos con facilidad.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-16 bg-white">
        <div className="mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Todo lo que necesitas para gestionar tus finanzas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 text-blue-500">
                <PieChart size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Presupuestos inteligentes
              </h3>
              <p className="text-gray-600">
                Crea presupuestos adaptados a tus necesidades y recibe alertas
                inteligentes para mantener tus gastos bajo control.
              </p>
            </div>

            <div className="feature-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 text-blue-500">
                <BarChart size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Análisis detallado
              </h3>
              <p className="text-gray-600">
                Visualiza tus patrones de gasto con gráficos intuitivos y
                descubre oportunidades para ahorrar más.
              </p>
            </div>

            <div className="feature-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 text-blue-500">
                <Target size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Metas financieras
              </h3>
              <p className="text-gray-600">
                Establece metas de ahorro y sigue tu progreso con herramientas
                de planificación a corto y largo plazo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works py-16 bg-gray-50">
        <div className="mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            ¿Cómo funciona Fintrack?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="step text-center">
              <div className="step-number mx-auto mb-4 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                Gestiona tus Metas financieras 
              </h3>
              <p className="text-gray-600">
                Al agregar una meta podras ahorrar una vez que tus presupuesto te lo permita y alcanzar tu objetivo con una gestión optima.
              </p>
            </div>

            <div className="step text-center">
              <div className="step-number mx-auto mb-4 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                Categoriza transacciones
              </h3>
              <p className="text-gray-600">
                Organiza automáticamente tus movimientos por categorías
                personalizables.
              </p>
            </div>

            <div className="step text-center">
              <div className="step-number mx-auto mb-4 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                Crea presupuestos
              </h3>
              <p className="text-gray-600">
                Establece límites de gasto para cada categoría según tus
                objetivos.
              </p>
            </div>

            <div className="step text-center">
              <div className="step-number mx-auto mb-4 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                Visualiza y optimiza
              </h3>
              <p className="text-gray-600">
                Analiza tus informes y ajusta tus estrategias financieras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-16 bg-blue-50">
        <div className="mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Beneficios de usar Fintrack
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="benefit-card flex p-4">
              <div className="icon mr-4 text-blue-500">
                <TrendingUp size={36} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Mejor salud financiera
                </h3>
                <p className="text-gray-600">
                  Reduce el estrés financiero al tener una visión clara de tu
                  situación económica y tomar decisiones más informadas.
                </p>
              </div>
            </div>

            <div className="benefit-card flex p-4">
              <div className="icon mr-4 text-blue-500">
                <Calendar size={36} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Planificación a futuro
                </h3>
                <p className="text-gray-600">
                  Prepárate para gastos importantes y establece estrategias para
                  lograr tus objetivos financieros a largo plazo.
                </p>
              </div>
            </div>

            <div className="benefit-card flex p-4">
              <div className="icon mr-4 text-blue-500">
                <CreditCard size={36} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Control de Presupuestos
                </h3>
                <p className="text-gray-600">
                  Gestiona tus presupuestos de manera
                  eficiente para reducir tus gastos inecesarios.
                </p>
              </div>
            </div>

            <div className="benefit-card flex p-4">
              <div className="icon mr-4 text-blue-500">
                <Shield size={36} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Seguridad garantizada
                </h3>
                <p className="text-gray-600">
                  Tu información financiera está protegida con los más altos
                  estándares de seguridad y cifrado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-16 bg-white">
        <div className="mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Lo que dicen nuestros usuarios
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial-card p-6 rounded-lg shadow-md bg-gray-50">
              <div className="flex items-center mb-4">
                <img
                  src= {PerroMelon}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">María González</h4>
                  <p className="text-gray-500 text-sm">Emprendedora</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Fintrack me ha ayudado a organizar tanto mis finanzas
                personales como las de mi pequeño negocio. La visualización de
                gastos me permite tomar mejores decisiones."
              </p>
              <div className="flex text-yellow-400 mt-3">
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
              </div>
            </div>

            <div className="testimonial-card p-6 rounded-lg shadow-md bg-gray-50">
              <div className="flex items-center mb-4">
                <img
                  src={Leon}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Carlos Mendoza</h4>
                  <p className="text-gray-500 text-sm">Profesional</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Desde que comencé a usar Fintrack, he podido ahorrar un 20% más
                cada mes. Las alertas de presupuesto me mantienen enfocado en
                mis objetivos financieros."
              </p>
              <div className="flex text-yellow-400 mt-3">
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
              </div>
            </div>

            <div className="testimonial-card p-6 rounded-lg shadow-md bg-gray-50">
              <div className="flex items-center mb-4">
                <img
                  src={BillsPirata}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Laura Jiménez</h4>
                  <p className="text-gray-500 text-sm">Estudiante</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Como estudiante, necesitaba una herramienta sencilla para
                gestionar mi presupuesto limitado. Fintrack me ha permitido
                estirar mi dinero y evitar deudas innecesarias."
              </p>
              <div className="flex text-yellow-400 mt-3">
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-12">
        <div className="mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="logo-container bg-white rounded-full p-1 w-10 h-10 flex items-center justify-center">
                   <img
              className="logo-fintrack"
              src={logoFintrack}
              alt="Logo Fintrack"
            />
                </div>
                <h3 className="text-xl font-bold">Fintrack</h3>
              </div>
              <p className="text-gray-300">
                La plataforma que te ayuda a tomar el control de tus finanzas
                personales.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/Acerca" className="text-gray-300 hover:text-white">
                    Sobre nosotros 
                  </Link>
                </li>
                <li>
                  <Link to="/Terminos" className="text-gray-300 hover:text-white">
                    Términos de servicio 
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Fintrack. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
      {mostrarVentana && (
        <VentanaConfiguracion
          usuario={usuario}
          onClose={handleCerrarVentana}
        />
      )}
    </div>
  );
}

export default Inicio;