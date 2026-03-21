const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    addLog: (data) => ipcRenderer.invoke("add-log", data),
    getLogs: () => ipcRenderer.invoke("get-logs"),
    hello: () => "Hello from Electron",
    addUser: (name) => db.addUser(name),
    openDevTools: () => ipcRenderer.send("open-devtools"),
    minimize: () => ipcRenderer.send("minimize"),
    maximize: () => ipcRenderer.send("maximize"),
    close: () => ipcRenderer.send("close")
});