const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'd:/mangalam-nextjs/.env' });

async function checkData() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });

    try {
        console.log('Checking Album 148:');
        const [album] = await db.query('SELECT * FROM photo_album WHERE id = 148');
        console.log(JSON.stringify(album, null, 2));

        console.log('\nChecking Gallery 7:');
        const [gallery] = await db.query('SELECT * FROM photo_gallery WHERE id = 7');
        console.log(JSON.stringify(gallery, null, 2));

        console.log('\nChecking images in Album 148:');
        const [images] = await db.query('SELECT COUNT(*) as count FROM album_image WHERE photo_album_id = 148');
        console.log(JSON.stringify(images, null, 2));

    } catch (error) {
        console.error(error);
    } finally {
        await db.end();
    }
}

checkData();
