import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";

import PaginaPrincipal from "./components/PaginaPrincipal/PaginaPricipal";
import InicioSesion from "./components/InicioSesion/InicioSesion";
import RegUsuario from "./components/RegistroUsuario/RegistroUsuario";
import Inicio from "./components/Inicio/Inicio";
import RouteWrapper from "./RouteWrapper";


const RouterWrapper = () => {
    const location = useLocation();
    const [rutaAnterior, setRutaAnterior] = useState(null);
    const prevLocationRef = useRef(location.pathname);

    useEffect(() => {
        setRutaAnterior(prevLocationRef.current);
        prevLocationRef.current = location.pathname;
    }, [location.pathname]);

    return (
        <AnimatePresence mode="wait">
            
            <Routes location={location} key={location.pathname}>
                <Route 
                    path="/" 
                    element={   
                        <RouteWrapper> 
                            <PaginaPrincipal rutaAnterior={rutaAnterior}/>
                        </RouteWrapper>
                    } 
                />
                {/* Aqui modifique y agregue la ruta de registro de usuario */}
                <Route path="/Login" element={ <RouteWrapper> <InicioSesion rutaAnterior={rutaAnterior}/> </RouteWrapper> } />
                <Route path="/SignUp" element={ <RouteWrapper> <RegUsuario rutaAnterior={rutaAnterior} /> </RouteWrapper>}/>
                <Route path="/Home" element={ <RouteWrapper> <Inicio rutaAnterior={rutaAnterior} /> </RouteWrapper>}/>

            </Routes>
        </AnimatePresence>
    );
};

export default RouterWrapper;
