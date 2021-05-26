import {GlobalKeyboardListener} from ".";

const v = new GlobalKeyboardListener({
    windows: {
        onError: errorCode => console.error("ERROR: " + errorCode),
        onInfo: info => console.info("INFO: " + info),
    },
    mac: {
        onError: errorCode => console.error("ERROR: " + errorCode),
    },
});
v.addListener(function (e, down) {
    console.log(
        e.name +
            " " +
            (e.state == "DOWN" ? "DOWN" : "UP  ") +
            "       [" +
            e.rawKey._nameRaw +
            "]"
    );

    if (
        e.state == "DOWN" &&
        e.name == "SPACE" &&
        (down["LEFT META"] || down["RIGHT META"])
    ) {
        console.log("captured");
        return true;
    }
    if (e.state == "DOWN" && e.name == "F") {
        // && (down["LEFT ALT"] || down["RIGHT ALT"])) {
        console.log("captured");
        const start = Date.now();
        while (Date.now() - start < 1000);

        return true;
    }
});
