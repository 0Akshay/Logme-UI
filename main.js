const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

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

app.whenReady().then(createWindow);