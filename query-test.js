import mysql from 'mysql2/promise';

async function test() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'mangalam'
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
    await connection.end();
}

test().catch(console.error);
