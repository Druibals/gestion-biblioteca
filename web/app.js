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
    try {
        const result = await db.query('SELECT 1');
        res.json(result.rows);
    }
    catch (error) {
        return res.status(500).json({ error: 'Database connection failed' });
    }
});

// Definir endpoint para obtener préstamos no devueltos

app.get('/api/loans/not-returned', async (req, res) => {
    try {
        const result = await db.query(`SELECT b.title, c.copy_code, u.email, l.loan_date, li.due_date, (CURRENT_DATE > li.due_date) AS overdue
FROM copies c
JOIN books b ON b.book_id = c.book_id
JOIN loan_items li ON li.copy_id = c.copy_id
JOIN loans l ON l.loan_id = li.loan_id
JOIN users u ON u.user_id = l.user_id
WHERE li.return_date IS NULL
ORDER BY b.title, c.copy_code;
`);
        res.json(result.rows);
    } catch (error) {
        console.error('Database query error: ', error); 
        return res.status(500).json({ error: 'Database query failed' });
    }
});

// Definir endpoint para obtener los autores con más libros publicados
app.get('/api/authors/top', async (req, res) => {
    try {
        const result = await db.query(`SELECT a.name, COUNT(b.book_id) AS num_books
FROM authors a
JOIN books b ON b.author_id = a.author_id
GROUP BY a.author_id, a.name
ORDER BY num_books DESC;
`);
        res.json(result.rows);
    } catch (error) {
        console.error('Database query error: ', error);
        return res.status(500).json({ error: 'Database query failed' });
    }
});

// Iniciar el servidor y escuchar en el puerto definido.

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});