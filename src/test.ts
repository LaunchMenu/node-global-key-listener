import {GlobalKeyboardListener} from ".";

const v = new GlobalKeyboardListener();
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
});
