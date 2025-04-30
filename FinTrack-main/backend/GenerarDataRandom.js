// GenerarDataRandom.js

// Función para generar nombres aleatorios de presidentes
function generarNombresAleatorios(cantidad) {
    const nombresBase = [
        "John Doe", "Jane Smith", "Robert Johnson", 
        "Emily Davis", "Michael Brown", "Sarah Wilson", 
        "David Martinez", "Laura Garcia", "James Anderson", 
        "Sophia Taylor"
    ];
    const nombresGenerados = [];

    for (let i = 0; i < cantidad; i++) {
        const nombreAleatorio = nombresBase[Math.floor(Math.random() * nombresBase.length)];
        nombresGenerados.push(nombreAleatorio);
    }

    return nombresGenerados;
}

// Función para generar votos aleatorios
function generarVotosAleatorios(cantidad) {
    const votos = [];
    for (let i = 0; i < cantidad; i++) {
        const votoAleatorio = Math.floor(Math.random() * 1000) + 1; // Votos entre 1 y 1000
        votos.push(votoAleatorio);
    }
    return votos;
}

// Generar datos aleatorios
function generarDatos(cantidadPresidentes) {
    const nombres = generarNombresAleatorios(cantidadPresidentes);
    const votos = generarVotosAleatorios(cantidadPresidentes);

    const datos = nombres.map((nombre, index) => ({
        presidente: nombre,
        votos: votos[index]
    }));

    return datos;
}

// Exportar datos generados
const datosAleatorios = generarDatos(5); // Cambia el número para generar más o menos presidentes
module.exports = datosAleatorios;