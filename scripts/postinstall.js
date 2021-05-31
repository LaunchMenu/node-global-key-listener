const {exec} = require("child_process");

if (process.platform == "darwin") {
    console.log("Post install:");
    exec("sudo chmod +x bin/MacKeyServer", (error, stdout, stderr) => {
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
