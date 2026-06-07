const mongoose = require('mongoose');

const personalSchema = new mongoose.Schema({
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
    cargo: {
        type: String,
        required: [true, 'El cargo es obligatorio'],
        trim: true
    },
    turno: {
        type: String,
        required: [true, 'El turno es obligatorio'],
        enum: ['Mañana', 'Tarde', 'Noche']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Personal', personalSchema);