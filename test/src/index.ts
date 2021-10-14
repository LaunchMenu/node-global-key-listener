import {app, BrowserWindow} from "electron";
import {GlobalKeyboardListener} from "node-global-key-listener";

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (require("electron-is-running-in-asar")()) {
        // Works in ASAR
        win.loadFile("build/index.html");
    } else {
        // Works during dev
        win.loadFile("index.html");
    }

    win.webContents.openDevTools();

    const listener = new GlobalKeyboardListener();
    listener.addListener(evt => {
        win.webContents.send("key", evt);
    });

    setTimeout(() => {
        win.webContents.send("key", "Communication test");
    }, 2000);
}

app.whenReady().then(createWindow);
