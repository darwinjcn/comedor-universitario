const express = require('express');
const router = express.Router();
const Compra = require('../models/Compra');

// CREATE
router.post('/compras', async (req, res) => {
    try {
        const nuevaCompra = new Compra(req.body);
        const compraGuardada = await nuevaCompra.save();
        res.status(201).json({
            mensaje: '✅ Compra registrada exitosamente',
            data: compraGuardada
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// READ - Todas
router.get('/compras', async (req, res) => {
    try {
        const compras = await Compra.find().populate('estudianteId platoId');
        res.json({
            total: compras.length,
            data: compras
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Por estudiante
router.get('/compras/estudiante/:estudianteId', async (req, res) => {
    try {
        const compras = await Compra.find({ estudianteId: req.params.estudianteId })
            .populate('platoId');
        res.json({
            total: compras.length,
            data: compras
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE
router.put('/compras/:id', async (req, res) => {
    try {
        const compraActualizada = await Compra.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!compraActualizada) {
            return res.status(404).json({ mensaje: 'Compra no encontrada' });
        }
        res.json({
            mensaje: '✅ Compra actualizada exitosamente',
            data: compraActualizada
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE
router.delete('/compras/:id', async (req, res) => {
    try {
        const compraEliminada = await Compra.findByIdAndDelete(req.params.id);
        if (!compraEliminada) {
            return res.status(404).json({ mensaje: 'Compra no encontrada' });
        }
        res.json({
            mensaje: '✅ Compra eliminada exitosamente',
            data: compraEliminada
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;