
import mysql from 'mysql2/promise';

let connection;

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,        
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_DATABASE,     
    });
  }
  return connection;
}

export async function query(sql, params) {
  const conn = await getConnection();
  const [results] = await conn.execute(sql, params);
  return results;
}