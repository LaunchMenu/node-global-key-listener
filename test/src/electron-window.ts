import {ipcRenderer} from "electron";

const container = window.document.getElementById("keypresses");
container?.append("Keys:");

ipcRenderer.on("key", (evt, data) => {
    if (!container) return;
    const div = document.createElement("div");
    div.innerText = JSON.stringify(data);

    const top = container.children.item(0);
    if (top) container.insertBefore(div, top);
    else container.append(div);
    window.document.body.scrollTop = 0;
});
