/*
    db.js - Módulo de configuración de la base de datos

    - Importa pool de pg para manejar conexiones a PostgreSQL
    - Crea el Pool con la configuración de conexión
    - Exporta una función query para ejecutar consultas SQL */

// Importar pool de pg
const { Pool } = require('pg');

// Crear el Pool con la configuración de conexión

const pool = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
})

// Crear función async

async function query(text, params) {
    return pool.query(text, params);
}

// Exportar la función query
module.exports = { query };