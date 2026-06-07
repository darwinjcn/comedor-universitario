const express = require('express');
const router = express.Router();
const Plato = require('../models/Plato');

// CREATE
router.post('/platos', async (req, res) => {
    try {
        const nuevoPlato = new Plato(req.body);
        const platoGuardado = await nuevoPlato.save();
        res.status(201).json({
            mensaje: '✅ Plato creado exitosamente',
            data: platoGuardado
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// READ - Todos
router.get('/platos', async (req, res) => {
    try {
        const platos = await Plato.find();
        res.json({
            total: platos.length,
            data: platos
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Por ID
router.get('/platos/:id', async (req, res) => {
    try {
        const plato = await Plato.findById(req.params.id);
        if (!plato) {
            return res.status(404).json({ mensaje: 'Plato no encontrado' });
        }
        res.json(plato);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE
router.put('/platos/:id', async (req, res) => {
    try {
        const platoActualizado = await Plato.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!platoActualizado) {
            return res.status(404).json({ mensaje: 'Plato no encontrado' });
        }
        res.json({
            mensaje: '✅ Plato actualizado exitosamente',
            data: platoActualizado
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE
router.delete('/platos/:id', async (req, res) => {
    try {
        const platoEliminado = await Plato.findByIdAndDelete(req.params.id);
        if (!platoEliminado) {
            return res.status(404).json({ mensaje: 'Plato no encontrado' });
        }
        res.json({
            mensaje: '✅ Plato eliminado exitosamente',
            data: platoEliminado
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;