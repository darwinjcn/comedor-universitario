const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
    cedula: {
        type: String,
        required: [true, 'La cédula es obligatoria'],
        unique: true,
        trim: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    carrera: {
        type: String,
        required: [true, 'La carrera es obligatoria'],
        trim: true
    },
    semestre: {
        type: Number,
        required: [true, 'El semestre es obligatorio'],
        min: 1,
        max: 10
    },
    saldo: {
        type: Number,
        required: true,
        default: 0.00,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Estudiante', estudianteSchema);