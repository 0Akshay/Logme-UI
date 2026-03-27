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
            Project_Name TEXT,
            Job_Name TEXT,
            Work_Item TEXT,
            Mail_Id TEXT,
            Employee_Id TEXT,
            Date TEXT,
            From_Time TEXT,
            To_Time TEXT,
            Hours TEXT,
            Sub_Task TEXT,
            Billable_Status TEXT
    )
    `).run();

    console.log("DB Initiated");
}

function getDB() {
    return db;
}

module.exports = { initDB, getDB };