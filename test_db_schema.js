import pool from './server/db.js';

async function testDb() {
    try {
        console.log("Testing DB Connection...");
        const [rows] = await pool.query('SHOW TABLES');
        console.log("Tables:");
        console.log(rows);

        for (const row of rows) {
            const tableName = Object.values(row)[0];
            const [columns] = await pool.query(`SHOW COLUMNS FROM ${tableName}`);
            console.log(`\nColumns for ${tableName}:`);
            console.log(columns.map(c => `${c.Field} (${c.Type})`).join(', '));
        }

        process.exit(0);
    } catch (e) {
        console.error("Error:", e.message);
        process.exit(1);
    }
}

testDb();
