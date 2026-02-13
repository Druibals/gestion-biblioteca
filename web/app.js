/* 
app.js - Punto de entrada de la aplicación

- Carga variables de entorno desde .env
- Importa Express para crear el servidor web y el módulo de base de datos para ejecutar consultas SQL
- Crea una instancia de Express y define el puerto de escucha
- Configura Express para servir archivos estáticos desde la carpeta 'public'
- Define un endpoint de salud para verificar la conexión a la base de datos
- Importa las consultas SQL definidas en queries.js
- Define los endpoints base para obtener préstamos no devueltos, los autores con más libros publicados y el historial de préstamos realizados
- Inicia el servidor y escucha en el puerto definido. Si la conexión es exitosa, muestra un mensaje en la consola indicando el puerto en el que se está ejecutando el sevidor.
*/

// Cargar variables de entorno desde .env
require('dotenv').config();

// nodemon: Prueba de reinicio automático del servidor al detectar cambios en el entry point.
const BOOT_ID = Date.now();
console.log(`[boot] BOOT_ID=${BOOT_ID}`);

// Importar Express y módulo de base de datos
const express = require('express');
const db = require('./db');

// Crear instancia de Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar Express para servir archivos estáticos desde la carpeta 'public'
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


// Definir endpoint de salud
app.get('/api/health', async (req, res) => {
    try {
        const result = await db.query('SELECT 1');
        res.json(result.rows);
    }
    catch (error) {
        return res.status(500).json({ error: 'Database connection failed' });
    }
});

// Importar consultas SQL desde queries.js
const queries = require('./queries');

/* ----------------------------------ENDPOINTS---------------------------------- */

// Definir endpoint para obtener el historial de todos los préstamos realizados

app.get('/api/loans', async (req, res) => {
    try { 
        const result = await db.query(queries.LOANS_ALL);
        res.json(result.rows);
    } catch (error) {
        console.error('Database query error: ', error);
        return res.status(500).json({ error: 'Database query failed' });
    }
});

// Definir endpoint para obtener préstamos no devueltos

app.get('/api/loans/not-returned', async (req, res) => {
    try {
        const result = await db.query(queries.LOANS_NOT_RETURNED);
        res.json(result.rows);
    } catch (error) {
        console.error('Database query error: ', error); 
        return res.status(500).json({ error: 'Database query failed' });
    }
});

// Definir endpoint para obtener los autores con más libros publicados

app.get('/api/authors/top', async (req, res) => {
    try {
        const result = await db.query(queries.AUTHORS_TOP);
        res.json(result.rows);
    } catch (error) {
        console.error('Database query error: ', error);
        return res.status(500).json({ error: 'Database query failed' });
    }
});

app.get('/api/ping', (req,res) => {
    res.json({ ok: true, boot: BOOT_ID });
});

// Iniciar el servidor y escuchar en el puerto definido.

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});