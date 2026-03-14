const Database = require("better-sqlite3");
const db = new Database("logme.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS timelogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    project_name TEXT,
    type TEXT,
    description TEXT,
    hours_spent TEXT
)
`).run();

function addUser(name) {
    const stmt = db.prepare("INSERT INTO users (name) VALUES (?)");
    const result = stmt.run(name);
    return result.lastInsertRowid;
}

function addTimelog(date, project_name, type, description, hours_spent) {
    const stmt = db.prepare("INSERT INTO timelogs (date, project_name, type, description, hours_spent) VALUES (?, ?, ?, ?, ?)");
    const result = stmt.run(date, project_name, type, description, hours_spent);
    return result.lastInsertRowid;
}

module.exports = { addUser, addTimelog };

console.log("DB FILE");