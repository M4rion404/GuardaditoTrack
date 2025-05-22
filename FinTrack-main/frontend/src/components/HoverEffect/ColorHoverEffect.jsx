
import React, { useState, useEffect } from 'react';
import './ColorHoverEffect.css'; // Asegúrate de crear este archivo

const ColorHoverEffect = () => {
  // Estado para rastrear los colores del degradado
  const [gradientColors, setGradientColors] = useState({
    from: 'var(--accent-color, #3498db)',
    to: 'var(--primary-color, #2980b9)'
  });
  // Estado para rastrear qué elemento está activo
  const [activeItem, setActiveItem] = useState('');
  
  // Colores asociados a cada elemento del menú - Usando pares de colores para degradados
  const menuGradients = {
    'Presupuestos': { from: ' #08ba49', to: ' #378ce6' },        // Azul degradado
    'Transacciones': { from: ' #08ba49', via: ' #378ce6', to: ' #9564ce' },        // Verde degradado
    'Metas y ahorros': { from: ' #3a9dfc', to: ' #b43aa8' },     // Morado degradado
    'Salud Financiera': { from: ' #4e87e7', to: ' #5501a0' },    // Naranja degradado
    'Categorías': { from: ' #32a6cd', to: ' #a006cb' },          // Azul oscuro degradado
    'default': { from: 'var(--accent-color, #3498db)', to: 'var(--primary-color, #2980b9)' } // Degradado por defecto
  };

  // Función para aplicar el degradado a los elementos con la clase hero-section
  const applyGradientToHero = (fromColor, toColor) => {
    const heroSections = document.querySelectorAll('.hero-section');
    heroSections.forEach(section => {
      section.style.background = `linear-gradient(45deg, ${fromColor}, ${toColor})`;
      section.style.transition = 'background 0.5s ease';
    });
  };

  // Función para aplicar el degradado al body como fondo general
  /* const applyGradientToBody = (fromColor, toColor) => {
    document.body.style.background = `linear-gradient(45deg, ${fromColor}, ${toColor})`;
    document.body.style.backgroundAttachment = 'fixed'; // Para que el degradado cubra toda la página
    document.body.style.transition = 'background 0.5s ease';
  }; */

  useEffect(() => {
    // Seleccionar todos los enlaces del menú
    const menuItems = document.querySelectorAll('.barra-navegacion-lista li a');
    
    // Aplicar el degradado predeterminado al inicio
    applyGradientToHero(gradientColors.from, gradientColors.to);
    
    // Función para manejar el evento mouseenter (cursor entra)
    const handleMouseEnter = (e) => {
      const menuText = e.target.textContent;
      const gradient = menuGradients[menuText] || menuGradients.default;
      
      setGradientColors(gradient);
      setActiveItem(menuText);
      
      // Aplicar el degradado a las secciones hero
      applyGradientToHero(gradient.from, gradient.to);
      
      // Aplicar un degradado sutil al fondo de la página para que se note en toda la pantalla
      /* applyGradientToBody(
        gradient.from + '99', // Añade transparencia al color (33 = 20% de opacidad)
        gradient.to + '66'    // Añade transparencia al color (19 = 10% de opacidad)
      ); */
    };
    
    // Función para manejar el evento mouseleave (cursor sale)
    const handleMouseLeave = () => {
      const defaultGradient = menuGradients.default;
      
      setGradientColors(defaultGradient);
      setActiveItem('');
      
      // Restaurar el degradado original
      applyGradientToHero(defaultGradient.from, defaultGradient.to);
      
      // Restaurar el fondo original
      document.body.style.background = '';
    };
    
    // Agregar eventos a cada elemento del menú
    menuItems.forEach(item => {
      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);
    });
    
    // Limpieza de eventos cuando el componente se desmonta
    return () => {
      menuItems.forEach(item => {
        item.removeEventListener('mouseenter', handleMouseEnter);
        item.removeEventListener('mouseleave', handleMouseLeave);
      });
      // Restaurar degradados originales al desmontar
      document.body.style.background = '';
      const heroSections = document.querySelectorAll('.hero-section');
      heroSections.forEach(section => {
        section.style.background = '';
      });
    };
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar el componente

};

export default ColorHoverEffect;
