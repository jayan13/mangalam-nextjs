const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Basic .env.local loader (kept consistent with other scripts)
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.production');
  if (!fs.existsSync(envPath)) return;

  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (!match) return;

    const key = match[1];
    let value = match[2] || '';

    if (
      value.length > 1 &&
      ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value.trim();
  });
}

loadEnv();

async function truncateStateWiseResult() {
  const host = process.env.DB_HOST === 'localhost' ? '127.0.0.1' : process.env.DB_HOST;
  const database = process.env.DB_DATABASE;

  if (!host || !process.env.DB_USER || !database) {
    throw new Error('Missing DB config. Ensure DB_HOST, DB_USER, and DB_DATABASE are set (e.g. in .env.local).');
  }

  const db = mysql.createPool({
    host,
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    password: process.env.DB_PASSWORD,
    database,
  });

  try {
    const truncateTableName = 'state_wise_result';
    console.log(`Truncating table ${database}.${truncateTableName}...`);
    await db.query('TRUNCATE TABLE ??', [truncateTableName]);

    console.log(`Altering table ${database}.parties (aliance_group enum)...`);
    await db.query(
      "ALTER TABLE `parties` CHANGE `aliance_group` `aliance_group` ENUM('NDA','UPA','BSP-SP','LDF','DMK','AIADMK','TMC','INC','LEFT+INC','MNM','URF','OTH') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;"
    );
    console.log('Done.');
  } finally {
    await db.end();
  }
}

truncateStateWiseResult().catch(err => {
  console.error('Failed to truncate state_wise_result:', err);
  process.exitCode = 1;
});
