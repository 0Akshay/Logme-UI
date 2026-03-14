const Database = require("better-sqlite3");
const db = new Database("app.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
)
`).run();

function addUser(name) {
    const stmt = db.prepare("INSERT INTO users (name) VALUES (?)");
    const result = stmt.run(name);
    return result.lastInsertRowid;
}

module.exports = { addUser };

console.log("DB FILE");