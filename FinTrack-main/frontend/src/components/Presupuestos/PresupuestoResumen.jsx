import React from "react";
import "./Presupuestos.css";

const PresupuestoResumen = ({ presupuestos }) => {
    // Cálculos de métricas
    const totalAhorrado = presupuestos.reduce((sum, p) => sum + Number(p.dinero_ahorrado || 0), 0);
    const totalMeta = presupuestos.reduce((sum, p) => sum + Number(p.meta_ahorro || 0), 0);
    const totalGastado = presupuestos.reduce((sum, p) => sum + Number(p.dinero_gastado || 0), 0);
    const promedioGasto = presupuestos.length ? totalGastado / presupuestos.length : 0;
    const montosIniciales = presupuestos.map((p) => Number(p.monto_inicial || 0));
    const presupuestoMax = montosIniciales.length ? Math.max(...montosIniciales) : 0;
    const presupuestoMin = montosIniciales.length ? Math.min(...montosIniciales) : 0;

    return (
        <div className="resumen-presupuestos">
            <h3>Resumen de Presupuestos</h3>
            <div className="resumen-metricas">
                <p className={totalAhorrado >= totalMeta ? "positivo" : "negativo"}>
                    <strong>Total Ahorrado:</strong> ${totalAhorrado.toFixed(2)}
                </p>
                <p className="positivo">
                    <strong>Total de Metas:</strong> ${totalMeta.toFixed(2)}
                </p>
                <p className={promedioGasto <= totalMeta * 0.25 ? "positivo" : "negativo"}>
                    <strong>Promedio de Gasto:</strong> ${promedioGasto.toFixed(2)}
                </p>
                <p className="positivo">
                    <strong>Presupuesto más alto:</strong> ${presupuestoMax.toFixed(2)}
                </p>
                <p className="negativo">
                    <strong>Presupuesto más bajo:</strong> ${presupuestoMin.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default PresupuestoResumen;
