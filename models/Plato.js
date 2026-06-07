const mongoose = require('mongoose');

const platoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del plato es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: 0
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: ['Desayuno', 'Almuerzo', 'Cena']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Plato', platoSchema);