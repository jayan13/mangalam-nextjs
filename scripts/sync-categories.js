const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Basic .env.local loader
function loadEnv() {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                let key = match[1];
                let value = match[2] || '';
                // Remove quotes if present
                if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                    value = value.replace(/^"|"$/g, '');
                } else if (value.length > 0 && value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") {
                    value = value.replace(/^'|'$/g, '');
                }
                process.env[key] = value.trim();
            }
        });
    }
}

loadEnv();

async function syncCategories() {
    // Fallback for localhost
    const host = process.env.DB_HOST === 'localhost' ? '127.0.0.1' : process.env.DB_HOST;

    const db = mysql.createPool({
        host: host,
        user: process.env.DB_USER,
        port: parseInt(process.env.DB_PORT || '3306'),
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });

    try {
        console.log('Fetching categories from database...');
        const [rows] = await db.query('SELECT id, name, parent_id, status, list_order FROM category WHERE status = 1 ORDER BY parent_id, list_order');

        // Organize into a tree and build links
        const categoryMap = {};
        const categories = [];

        // First pass: Create category objects and build slugs
        rows.forEach(row => {
            const slug = row.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_]+/g, '-')
                .replace(/^-+|-+$/g, '');

            const category = {
                id: row.id,
                name: row.name,
                slug: slug,
                parent_id: row.parent_id,
                link: `/category/${row.id}-${slug}.html`,
                children: []
            };

            categoryMap[row.id] = category;
        });

        // Second pass: Link children to parents
        rows.forEach(row => {
            const category = categoryMap[row.id];
            if (row.parent_id && categoryMap[row.parent_id]) {
                categoryMap[row.parent_id].children.push(category);
            } else {
                categories.push(category);
            }
        });

        const dataPath = path.join(__dirname, '..', 'src', 'data', 'categories.json');
        fs.writeFileSync(dataPath, JSON.stringify(categories, null, 2));

        console.log(`Successfully synced ${rows.length} categories to ${dataPath}`);

        // Also generate a flat map for quick lookup by ID
        const flatMapPath = path.join(__dirname, '..', 'src', 'data', 'categories-map.json');
        fs.writeFileSync(flatMapPath, JSON.stringify(categoryMap, null, 2));

        console.log(`Generated flat map at ${flatMapPath}`);

    } catch (error) {
        console.error('Error syncing categories:', error);
    } finally {
        await db.end();
    }
}

syncCategories();
