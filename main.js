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

    const stmt = db.prepare("INSERT INTO timelogs (Project_Name, Job_Name, Work_Item, Mail_Id, Employee_ID, Date, From_Time, To_Time, Hours, Sub_Task, Billable_Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    const projectName = data["project_name"];
    const jobName = data["project_name"];
    const workItem = data["type"];
    const mailId = "akshay.singh@rstartec.com";
    const employeeId = "";
    const Date = data["date"];
    const fromTime = "";
    const toTime = "";
    const hours = data["hours_spent"];
    const subTask = data["description"];
    const billableStatus = data["billability"];

    const result = stmt.run(projectName, jobName, workItem, mailId, employeeId, Date, fromTime, toTime, hours, subTask, billableStatus);

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

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;

    } catch (err) {
        return '';
    }
}

ipcMain.handle("export-excel", async () => {
    try {
        const db = getDB();
        const rows = db.prepare("SELECT * FROM timelogs").all();

        const formattedRows = rows.map(row => ({
            "Project Name": row.Project_Name,
            "Job Name": row.Job_Name,
            "Work Item": row.Work_Item,
            "Mail Id": row.Mail_Id,
            "Employee Id": row.Employee_Id,
            "Date": formatDate(row.Date),
            "From Time": row.From_Time,
            "To Time": row.To_Time,
            "Hours": row.Hours,
            "Sub Task": row.Sub_Task,
            "Billable Status": row.Billable_Status
        }));

        // Convert to Excel
        const worksheet = XLSX.utils.json_to_sheet(formattedRows);
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