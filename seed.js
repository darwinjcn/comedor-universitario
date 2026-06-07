/**
 * 🌱 Script de Seeding — Comedor Universitario
 * Ejecutar: node seed.js
 * Inserta datos de prueba en las 5 colecciones respetando los esquemas Mongoose.
 */
require('dotenv').config();
const mongoose = require('mongoose');

const Compra = require('./models/Compra');
const Estudiante = require('./models/Estudiante');
const Menu = require('./models/Menu');
const Personal = require('./models/Personal');
const Plato = require('./models/Plato');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/comedor_universitario';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB para carga de datos...\n');

        await Compra.deleteMany({});
        await Estudiante.deleteMany({});
        await Menu.deleteMany({});
        await Personal.deleteMany({});
        await Plato.deleteMany({});
        console.log('🧹 Colecciones limpiadas.\n');

        // ─── 1. PLATOS ───
        const platos = await Plato.insertMany([
            { nombre: 'Pabellón Criollo', descripcion: 'Arroz blanco, carne mechada, caraotas y tajadas', precio: 5.50, disponible: true, categoria: 'Almuerzo' },
            { nombre: 'Ensalada César con Pollo', descripcion: 'Lechuga romana, pechuga grillada, crutones y aderezo', precio: 4.00, disponible: true, categoria: 'Almuerzo' },
            { nombre: 'Sopa de Pollo', descripcion: 'Caldo de pollo con apio, zanahoria y papa', precio: 2.50, disponible: true, categoria: 'Almuerzo' },
            { nombre: 'Jugo Natural de Naranja', descripcion: 'Jugo exprimido 100% natural', precio: 1.50, disponible: true, categoria: 'Desayuno' },
            { nombre: 'Arepa con Queso y Jamón', descripcion: 'Arepa asada con queso guayanés y jamón', precio: 3.00, disponible: true, categoria: 'Desayuno' },
            { nombre: 'Pasta Alfredo', descripcion: 'Fettuccine en salsa Alfredo con queso parmesano', precio: 4.50, disponible: false, categoria: 'Cena' }
        ]);
        console.log(`🍽️  ${platos.length} platos insertados`);

        // ─── 2. ESTUDIANTES (cedula String, nombre, carrera, semestre, saldo) ───
        const estudiantes = await Estudiante.insertMany([
            { cedula: '17205680', nombre: 'Ana Contreras', carrera: 'Ingeniería en Informática', semestre: 6, saldo: 25.00 },
            { cedula: '30730461', nombre: 'Diana Sierra', carrera: 'Ingeniería en Informática', semestre: 6, saldo: 18.50 },
            { cedula: '19064945', nombre: 'Darwin Colmenares', carrera: 'Ingeniería en Informática', semestre: 6, saldo: 30.00 },
            { cedula: '10000256', nombre: 'Pedro Pérez', carrera: 'Ingeniería en Telecomunicaciones', semestre: 2, saldo: 10.00 },
            { cedula: '11256369', nombre: 'Juana Pérez', carrera: 'Ingeniería en Telecomunicaciones', semestre: 4, saldo: 15.00 },
            { cedula: '25487963', nombre: 'Luisa Fernández', carrera: 'Ingeniería en Informática', semestre: 4, saldo: 22.00 }
        ]);
        console.log(`🎓 ${estudiantes.length} estudiantes insertados`);

        // ─── 3. PERSONAL (cedula String, nombre, cargo, turno, telefono) ───
        const personal = await Personal.insertMany([
            { cedula: '12345678', nombre: 'Carlos Rodríguez', cargo: 'Cocinero Jefe', turno: 'Mañana', telefono: '0414-1234567' },
            { cedula: '87654321', nombre: 'María Elena García', cargo: 'Cajera', turno: 'Tarde', telefono: '0412-7654321' },
            { cedula: '45678912', nombre: 'José Luis Martínez', cargo: 'Mesero', turno: 'Mañana', telefono: '0416-1112233' },
            { cedula: '78912345', nombre: 'Laura Pérez', cargo: 'Administradora', turno: 'Tarde', telefono: '0424-9876543' },
            { cedula: '32165498', nombre: 'Roberto Silva', cargo: 'Auxiliar de Cocina', turno: 'Noche', telefono: '0412-5566778' }
        ]);
        console.log(`👨‍🍳 ${personal.length} personal insertado`);

        // ─── 4. MENÚS (fecha Date, diaSemana, platoPrincipal, ensalada, postre) ───
        const menus = await Menu.insertMany([
            { fecha: new Date('2026-06-08'), diaSemana: 'Lunes', platoPrincipal: 'Pabellón Criollo', ensalada: 'Ensalada César', postre: 'Gelatina de Fresa' },
            { fecha: new Date('2026-06-09'), diaSemana: 'Martes', platoPrincipal: 'Pasta Alfredo', ensalada: 'Ensalada Mixta', postre: 'Flan de Caramelo' },
            { fecha: new Date('2026-06-10'), diaSemana: 'Miércoles', platoPrincipal: 'Sopa de Pollo', ensalada: 'Ensalada de Repollo', postre: 'Arroz con Leche' },
            { fecha: new Date('2026-06-11'), diaSemana: 'Jueves', platoPrincipal: 'Arepa con Queso y Jamón', ensalada: 'Ensalada de Tomate', postre: 'Quesillo' },
            { fecha: new Date('2026-06-12'), diaSemana: 'Viernes', platoPrincipal: 'Ensalada César con Pollo', ensalada: 'Ensalada de Aguacate', postre: 'Torta de Chocolate' }
        ]);
        console.log(`📋 ${menus.length} menús insertados`);

        // ─── 5. COMPRAS (estudianteId ObjectId, platoId ObjectId, fecha, hora, monto, estado) ───
        // Usamos los _id generados de estudiantes y platos
        const compras = await Compra.insertMany([
            { estudianteId: estudiantes[0]._id, platoId: platos[0]._id, fecha: new Date('2026-06-07T12:30:00'), hora: '12:30', monto: 5.50, estado: 'pagado' },
            { estudianteId: estudiantes[1]._id, platoId: platos[1]._id, fecha: new Date('2026-06-07T12:45:00'), hora: '12:45', monto: 4.00, estado: 'pagado' },
            { estudianteId: estudiantes[2]._id, platoId: platos[0]._id, fecha: new Date('2026-06-07T13:00:00'), hora: '13:00', monto: 5.50, estado: 'pagado' },
            { estudianteId: estudiantes[3]._id, platoId: platos[3]._id, fecha: new Date('2026-06-07T08:15:00'), hora: '08:15', monto: 1.50, estado: 'pagado' },
            { estudianteId: estudiantes[4]._id, platoId: platos[5]._id, fecha: new Date('2026-06-07T19:20:00'), hora: '19:20', monto: 4.50, estado: 'pendiente' },
            { estudianteId: estudiantes[5]._id, platoId: platos[4]._id, fecha: new Date('2026-06-07T09:00:00'), hora: '09:00', monto: 3.00, estado: 'cancelado' }
        ]);
        console.log(`🛒 ${compras.length} compras insertadas\n`);

        console.log('✅✅✅ Base de datos poblada exitosamente ✅✅✅');
        console.log('\n📊 Resumen:');
        console.log(`   • Platos:      ${platos.length}`);
        console.log(`   • Estudiantes: ${estudiantes.length}`);
        console.log(`   • Personal:    ${personal.length}`);
        console.log(`   • Menús:       ${menus.length}`);
        console.log(`   • Compras:     ${compras.length}`);

        await mongoose.connection.close();
        console.log('\n🔌 Conexión cerrada.');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error al poblar la base de datos:');
        console.error(error.message);
        if (error.errors) {
            console.error('\nDetalles de validación:');
            Object.keys(error.errors).forEach(key => {
                console.error(`   • ${key}: ${error.errors[key].message}`);
            });
        }
        process.exit(1);
    }
};

seedData();