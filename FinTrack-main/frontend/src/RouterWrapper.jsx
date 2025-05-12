import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";

import PaginaPrincipal from "./components/PaginaPrincipal/PaginaPricipal";
import InicioSesion from "./components/InicioSesion/InicioSesion";
import RegUsuario from "./components/RegistroUsuario/RegistroUsuario";
import Inicio from "./components/Inicio/Inicio";
import Categorias from "./components/Categorias/Categorias";
import Presupuestos from "./components/Presupuestos/Presupuestos";
import Transacciones from "./components/Transacciones/Transacciones";
import MetasAhorro from "./components/MetasAhorro/MetasAhorro";
import SaludFinanciera from "./components/SaludFinanciera/SaludFinanciera";
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
                <Route path="/Categorias" element={ <RouteWrapper> <Categorias rutaAnterior={rutaAnterior} /> </RouteWrapper>}/>
                <Route path="/Presupuestos" element={ <RouteWrapper> <Presupuestos rutaAnterior={rutaAnterior} /> </RouteWrapper>}/>
                <Route path="/Transacciones" element={ <RouteWrapper> <Transacciones rutaAnterior={rutaAnterior} /> </RouteWrapper>}/>
                <Route path="/MetasAhorro" element={ <RouteWrapper> <MetasAhorro rutaAnterior={rutaAnterior} /> </RouteWrapper>}/>
                <Route path="/SaludFinanciera" element={ <RouteWrapper> <SaludFinanciera rutaAnterior={rutaAnterior} /> </RouteWrapper>}/>

            </Routes>
        </AnimatePresence>
    );
};

export default RouterWrapper;
