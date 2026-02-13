const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'portfolio.db');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database
function initDb() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS investments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asset_type TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL
        )
    `;
  db.exec(createTableQuery);
  console.log('Database initialized with investments table.');
}

initDb();

module.exports = db;
