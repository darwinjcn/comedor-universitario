const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria'],
        unique: true
    },
    diaSemana: {
        type: String,
        required: [true, 'El día de la semana es obligatorio'],
        enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
    },
    platoPrincipal: {
        type: String,
        required: [true, 'El plato principal es obligatorio'],
        trim: true
    },
    ensalada: {
        type: String,
        required: [true, 'La ensalada es obligatoria'],
        trim: true
    },
    postre: {
        type: String,
        required: [true, 'El postre es obligatorio'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Menu', menuSchema);