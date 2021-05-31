if (process.platform == "darwin") {
    console.log("Post install:");
    const sudo = require("sudo-prompt");
    const options = {
        name: "Global key listener",
    };
    sudo.exec("chmod +x bin/MacKeyServer", options, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}
