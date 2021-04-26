//Change directory to make sure ./ is working correctly
import process from "process"
process.chdir("../../..")


import { MacKeyServer } from "../MacKeyServer";

var v = new MacKeyServer(function(e){
    console.log(e);
    if(e.name == "B") v.stop(); //Quit on B press
    return e.name == "A"; //Capture only A keys
});
v.start();