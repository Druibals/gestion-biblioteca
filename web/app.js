/* 
app.js - Punto de entrada de la aplicación

- Carga variables de entorno desde .env
- Importa Express para crear el servidor web y el módulo de base de datos para ejecutar consultas SQL
- Crea una instancia de Express y define el puerto de escucha
- Configura Express para servir archivos estáticos desde la carpeta 'public'
- Define un endpoint de salud para verificar la conexión a la base de datos
- Inicia el servidor y escucha en el puerto definido. Si la conexión es exitosa, muestra un mensaje en la consola indicando el puerto en el que se está ejecutando el sevidor.
*/

// Cargar variables de entorno desde .env
require('dotenv').config();

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
    // const result = await db.query('SELECT 1');
    // res.json(result.rows);
    try {
        const result = await db.query('SELECT 1');
        res.json(result.rows);
    }
    catch (error) {
        return res.status(500).json({ error: 'Database connection failed' });
    }
});

// Iniciar el servidor y escuchar en el puerto definido.

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});