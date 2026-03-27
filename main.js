const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { initDB, getDB } = require("./database/db");
const XLSX = require("xlsx");

function createWindow() {

    const isMac = process.platform === "darwin";

    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        titleBarStyle: "hidden",
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    win.loadFile("renderer/index.html");
    // win.webContents.openDevTools();
}

ipcMain.handle("add-log", (event, data) => {
    const db = getDB();
    console.log("Add log called");

    const stmt = db.prepare("INSERT INTO timelogs (date, project_name, type, description, hours_spent, billability) VALUES (?, ?, ?, ?, ?, ?)");

    const date = data["date"];
    const project_name = data["project_name"];
    const type = data["type"];
    const description = data["description"];
    const hours_spent = data["hours_spent"];
    const billability = data["billability"];

    const result = stmt.run(date, project_name, type, description, hours_spent, billability);

    return result.lastInsertRowid;
});

ipcMain.handle("get-logs", () => {
    console.log("Get Logs Called");
    const db = getDB();
    return db.prepare("SELECT * FROM timelogs").all();
})

ipcMain.on("open-devtools", (event) => {
    event.sender.openDevTools();
});

ipcMain.on("minimize", (event) => {
    BrowserWindow.fromWebContents(event.sender).minimize();
})

ipcMain.on("maximize", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win.isMaximized() ? win.unmaximize() : win.maximize();
})

ipcMain.on("close", (event) => {
    BrowserWindow.fromWebContents(event.sender).close();
});


ipcMain.handle("export-excel", async () => {
    try {
        const db = getDB();
        const rows = db.prepare("SELECT * FROM timelogs").all();

        // Convert to Excel
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Timelog");

        // File path 
        const filePath = path.join(app.getPath("downloads"), "Timelogs.xlsx");

        // Write file
        XLSX.writeFile(workbook, filePath);

        return filePath;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});

app.whenReady().then(() => {
    initDB(app);
    createWindow();
});