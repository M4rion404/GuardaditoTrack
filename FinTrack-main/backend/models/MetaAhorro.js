const mongoose = require('mongoose');

const MetaAhorroSchema = new mongoose.Schema({

    nombre: { type: String, required: true },
    descripcion: { type: String },

    objetivo: { type: Number, require: true },
    ahorrado: { type: Number, default: 0 },
    
    fecha_limite: { type: Date, required: true },
    fecha: { type: Date, default: Date.now },

    estado: { type: String, enum: ['Ahorrando', 'Completada'], default: "Ahorrando" },
    
    // etiquetas: [
    //     {
    //         nombre_etiqueta: { type: String } // Viaje, Gaming, Moto, Salida, Cine, Billar, etc
    //     }
    // ],
    
    // historial_ingresos:[
    //     { 
    //         transaccion_asociada: { type: String },
    //         accion: { type: String }, // Retiro / Ingreso
    //         monto: { type: Number },
    //         descripcion: { type: String }, 
    //     }
    // ]

});

module.exports = MetaAhorroSchema;