const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");
const db = require(path.join(__dirname, "database", "db"));

contextBridge.exposeInMainWorld("api", {
    hello: () => "Hello from Electron",
    addUser: (name) => db.addUser(name),
    addTimelog: (date, project_name, type, description, hours_spent) => db.addTimelog(date, project_name, type, description, hours_spent),
    openDevTools: () => ipcRenderer.send("open-devtools"),
    minimize: () => ipcRenderer.send("minimize"),
    maximize: () => ipcRenderer.send("maximize"),
    close: () => ipcRenderer.send("close")
});