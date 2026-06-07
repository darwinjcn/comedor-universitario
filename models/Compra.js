const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
    estudianteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: [true, 'El estudiante es obligatorio']
    },
    platoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plato',
        required: [true, 'El plato es obligatorio']
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria'],
        default: Date.now
    },
    hora: {
        type: String,
        required: [true, 'La hora es obligatoria']
    },
    monto: {
        type: Number,
        required: [true, 'El monto es obligatorio'],
        min: 0
    },
    estado: {
        type: String,
        required: true,
        enum: ['pagado', 'pendiente', 'cancelado'],
        default: 'pagado'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Compra', compraSchema);