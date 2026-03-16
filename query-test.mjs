import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config({ path: '.env.local' });

async function test() {
    console.log("Connecting to:", process.env.DB_HOST, process.env.DB_DATABASE);
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT
    });

    console.time("rss-query");
    const [rows] = await connection.query(`
        SELECT 
            news.id, 
            CONVERT(news.title USING utf8) as title, 
            news.eng_title, 
            news.eng_summary, 
            CONVERT(news.news_details USING utf8) as news_details,
            news.effective_date,
            news_image.file_name as thumbnail
        FROM news 
        LEFT JOIN news_image ON news_image.news_id = news.id
        WHERE news.published = 1 
        AND NOW() BETWEEN news.effective_date AND news.expiry_date 
        GROUP BY news.id 
        ORDER BY news.effective_date DESC 
        LIMIT 50
    `);
    console.timeEnd("rss-query");
    console.log("Rows returned:", rows.length);
    
    // Test district query as well
    console.time("district-query");
    const district_id = 0;
    const [distRows] = await connection.query(`
        SELECT 
            news.id,
            news.title,
            news.eng_title,
            news_image.file_name,
            CONVERT(news.news_details USING utf8) as news_details,
            if(news_image.title, news_image.title, news.title) as alt,
            "" as url,
            news.district_id 
        FROM news 
        LEFT JOIN news_image ON news_image.news_id = news.id 
        WHERE news.published = 1 
            AND NOW() BETWEEN news.effective_date AND news.expiry_date 
            AND (? = 0 OR news.district_id = ?) 
        GROUP BY news.id 
        ORDER BY news.effective_date DESC 
        LIMIT 0, 8
    `, [district_id, district_id]);
    console.timeEnd("district-query");

    await connection.end();
}

test().catch(console.error);
