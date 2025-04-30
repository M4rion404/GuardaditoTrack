import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

function RouteWrapper({ children, rutaAnterior }) {
  const location = useLocation();

  const animacion = (() => {

    if (rutaAnterior === '/' && location.pathname === '/Login') {
      return {
        initial: { y: '100%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '-100%', opacity: 0 },
      };
    } else if (rutaAnterior === '/Login' && location.pathname === '/') {
      return {
        initial: { y: '-100%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '-100%', opacity: 0 },
      };

    } else {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    }
  })();

  return (
    <motion.div
      key={location.pathname}
      initial={animacion.initial}
      animate={animacion.animate}
      exit={animacion.exit}
      transition={{ duration: 0.5 }}
      style={{ position: 'absolute', width: '100%' }}
    >
      {children}
    </motion.div>
  );
}

export default RouteWrapper;
