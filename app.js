require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Importar rutas
const estudiantesRoutes = require('./routes/estudiantes');
const platosRoutes = require('./routes/platos');
const menuRoutes = require('./routes/menu');
const comprasRoutes = require('./routes/compras');
const personalRoutes = require('./routes/personal');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🆕 Servir archivos estáticos del frontend (debe ir ANTES de las rutas API)
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MongoDB
connectDB();

// Rutas de la API
app.use(estudiantesRoutes);
app.use(platosRoutes);
app.use(menuRoutes);
app.use(comprasRoutes);
app.use(personalRoutes);

// Ruta principal (API info) — solo responde JSON si no encuentra index.html
app.get('/api', (req, res) => {
    res.json({
        mensaje: '🍽️ Sistema de Gestión de Comedor Universitario - UNETI',
        version: '1.0.0',
        endpoints: {
            estudiantes: '/estudiantes',
            platos: '/platos',
            menu: '/menu',
            compras: '/compras',
            personal: '/personal'
        }
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 http://localhost:${PORT}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}/index.html`);
});