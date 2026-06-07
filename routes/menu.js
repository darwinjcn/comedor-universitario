const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// CREATE
router.post('/menu', async (req, res) => {
    try {
        const nuevoMenu = new Menu(req.body);
        const menuGuardado = await nuevoMenu.save();
        res.status(201).json({
            mensaje: '✅ Menú creado exitosamente',
            data: menuGuardado
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// READ - Todos
router.get('/menu', async (req, res) => {
    try {
        const menus = await Menu.find().sort({ fecha: -1 });
        res.json({
            total: menus.length,
            data: menus
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Por fecha
router.get('/menu/fecha/:fecha', async (req, res) => {
    try {
        const menu = await Menu.findOne({ fecha: req.params.fecha });
        if (!menu) {
            return res.status(404).json({ mensaje: 'Menú no encontrado' });
        }
        res.json(menu);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE
router.put('/menu/:id', async (req, res) => {
    try {
        const menuActualizado = await Menu.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!menuActualizado) {
            return res.status(404).json({ mensaje: 'Menú no encontrado' });
        }
        res.json({
            mensaje: '✅ Menú actualizado exitosamente',
            data: menuActualizado
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE
router.delete('/menu/:id', async (req, res) => {
    try {
        const menuEliminado = await Menu.findByIdAndDelete(req.params.id);
        if (!menuEliminado) {
            return res.status(404).json({ mensaje: 'Menú no encontrado' });
        }
        res.json({
            mensaje: '✅ Menú eliminado exitosamente',
            data: menuEliminado
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;