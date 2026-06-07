const express = require('express');
const router = express.Router();
const Personal = require('../models/Personal');

// CREATE
router.post('/personal', async (req, res) => {
    try {
        const nuevoPersonal = new Personal(req.body);
        const personalGuardado = await nuevoPersonal.save();
        res.status(201).json({
            mensaje: '✅ Personal registrado exitosamente',
            data: personalGuardado
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// READ - Todos
router.get('/personal', async (req, res) => {
    try {
        const personal = await Personal.find();
        res.json({
            total: personal.length,
            data: personal
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Por ID
router.get('/personal/:id', async (req, res) => {
    try {
        const empleado = await Personal.findById(req.params.id);
        if (!empleado) {
            return res.status(404).json({ mensaje: 'Personal no encontrado' });
        }
        res.json(empleado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE
router.put('/personal/:id', async (req, res) => {
    try {
        const personalActualizado = await Personal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!personalActualizado) {
            return res.status(404).json({ mensaje: 'Personal no encontrado' });
        }
        res.json({
            mensaje: '✅ Personal actualizado exitosamente',
            data: personalActualizado
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE
router.delete('/personal/:id', async (req, res) => {
    try {
        const personalEliminado = await Personal.findByIdAndDelete(req.params.id);
        if (!personalEliminado) {
            return res.status(404).json({ mensaje: 'Personal no encontrado' });
        }
        res.json({
            mensaje: '✅ Personal eliminado exitosamente',
            data: personalEliminado
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;