import {GlobalKeyboardListener} from ".";

const v = new GlobalKeyboardListener();
v.addListener(function (e) {
    console.log(
        e.name +
            " " +
            (e.state == "DOWN" ? "DOWN" : "UP  ") +
            "       [" +
            e.rawKey._nameRaw +
            "]"
    );
});
