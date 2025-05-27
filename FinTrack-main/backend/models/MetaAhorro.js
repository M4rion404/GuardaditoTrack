const mongoose = require('mongoose');

const MetaAhorroSchema = new mongoose.Schema({

    nombre: { type: String, required: true },
    descripcion: { type: String },

    objetivo: { type: Number, require: true },
    ahorrado: { type: Number, default: 0 },
    
    fecha_limite: { type: Date, required: true },
    fecha: { type: Date, default: Date.now },

    estado: { type: String, enum: ['Ahorrando', 'Completada'], default: "Ahorrando" },
    

    // Las únicamente es un texto con el nombre de una categoría
    etiquetas: [
        {
            nombre_etiqueta: { type: String } 
        }
    ],

    // Historial de ingresos
    historial_ingresos:[
        { 
            transaccion_asociada: { type: String },
            accion: { type: String }, 
            monto: { type: Number },
            descripcion: { type: String }, 
        }
    ]

});

module.exports = MetaAhorroSchema;