const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: 'd:/mangalam-nextjs/.env' });

async function checkSchema() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });

    try {
        const [rows] = await db.query('SELECT * FROM album_image LIMIT 1');
        console.log('Columns in album_image:', Object.keys(rows[0] || {}).join(', '));
        const [albumRows] = await db.query('SELECT * FROM photo_album LIMIT 1');
        console.log('Columns in photo_album:', Object.keys(albumRows[0] || {}).join(', '));
    } catch (error) {
        console.error(error);
    } finally {
        await db.end();
    }
}

checkSchema();
