const express = require('express');
const router = express.Router();
const Estudiante = require('../models/Estudiante');

// CREATE - Crear estudiante
router.post('/estudiantes', async (req, res) => {
    try {
        const nuevoEstudiante = new Estudiante(req.body);
        const estudianteGuardado = await nuevoEstudiante.save();
        res.status(201).json({
            mensaje: '✅ Estudiante creado exitosamente',
            data: estudianteGuardado
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// READ - Obtener todos los estudiantes
router.get('/estudiantes', async (req, res) => {
    try {
        const estudiantes = await Estudiante.find();
        res.json({
            total: estudiantes.length,
            data: estudiantes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Obtener un estudiante por ID
router.get('/estudiantes/:id', async (req, res) => {
    try {
        const estudiante = await Estudiante.findById(req.params.id);
        if (!estudiante) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }
        res.json(estudiante);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE - Actualizar estudiante
router.put('/estudiantes/:id', async (req, res) => {
    try {
        const estudianteActualizado = await Estudiante.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!estudianteActualizado) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }
        res.json({
            mensaje: '✅ Estudiante actualizado exitosamente',
            data: estudianteActualizado
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE - Eliminar estudiante
router.delete('/estudiantes/:id', async (req, res) => {
    try {
        const estudianteEliminado = await Estudiante.findByIdAndDelete(req.params.id);
        if (!estudianteEliminado) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }
        res.json({
            mensaje: '✅ Estudiante eliminado exitosamente',
            data: estudianteEliminado
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CONSULTA SENCILLA - Estudiantes con saldo mayor a X
router.get('/estudiantes/saldo/:monto', async (req, res) => {
    try {
        const monto = parseFloat(req.params.monto);
        const estudiantes = await Estudiante.find({ saldo: { $gt: monto } });
        res.json({
            mensaje: `Estudiantes con saldo mayor a ${monto} Bs`,
            total: estudiantes.length,
            data: estudiantes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;