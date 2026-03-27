const path = require("path");
const Database = require("better-sqlite3");

let db;

function initDB(app) {
    const dbPath = path.join(app.getPath("userData"), "logme.db");
    db = new Database(dbPath);
    console.log(dbPath);
    db.prepare(`
        CREATE TABLE IF NOT EXISTS timelogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        project_name TEXT,
        type TEXT,
        description TEXT,
        hours_spent TEXT,
        billability TEXT
    )
    `).run();

    console.log("DB Initiated");
}

function getDB() {
    return db;
}

module.exports = { initDB, getDB };