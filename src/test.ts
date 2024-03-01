import {GlobalKeyboardListener} from ".";

const v = new GlobalKeyboardListener({
    windows: {
        onError: errorCode => console.error("ERROR: " + errorCode),
        onInfo: info => console.info("INFO: " + info),
    },
    mac: {
        onError: errorCode => console.error("ERROR: " + errorCode),
        onInfo: info => console.info("INFO: " + info),
    },
});
v.addListener(function (e, down) {
    console.log(
        e.name?.padStart(16),
        e.state.padStart(4),
        e.rawKey?._nameRaw.padStart(32),
        e.location?.map(x => x.toFixed(2)).join(' ').padStart(32),
    );

    if (
        e.state == "DOWN" &&
        e.name == "SPACE" &&
        (down["LEFT META"] || down["RIGHT META"])
    ) {
        console.log("captured");
        return true;
    }
    if (e.state == "DOWN" && e.name == "I" && (down["LEFT META"] || down["RIGHT META"])) {
        console.log("captured");
        return true;
    }
    if (e.state == "DOWN" && e.name == "F") {
        // && (down["LEFT ALT"] || down["RIGHT ALT"])) {
        console.log("captured attempted");
        const start = Date.now();
        while (Date.now() - start < 3000);

        return true;
    }

    if (e.state == "DOWN" && e.name == "M") {
        return true;
    }
    if (e.state == "DOWN" && e.name == "N") {
        throw "Shit";
        console.log("captured");
        return true;
    }
})
    .then(() => console.log("Success"))
    .catch(e => console.log("Error: " + e));
