const mongoose = require('mongoose');

const MetaAhorroSchema = new mongoose.Schema({

    nombre: { type: String, required: true },
    descripcion: { type: String },
    objetivo: { type: Number },
    fecha_limite: { type: Date, required: true },
    estado: { type: String, enum: ['Ahorrando', 'Completada'], default: "Ahorrando" }

});

module.exports = MetaAhorroSchema;