import {app, BrowserWindow} from "electron";
import {GlobalKeyboardListener} from ".";

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile("../index.html");
    win.webContents.openDevTools();

    const listener = new GlobalKeyboardListener();
    listener.addListener(evt => {
        win.webContents.send("key", evt);
        console.log("sent");
    });
}

app.whenReady().then(createWindow);
