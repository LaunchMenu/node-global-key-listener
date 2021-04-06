var spawn = require("child_process").spawn

var ret;
var myArr = [0,0,1,1,0,1,0,1];
const proc = spawn("./main");

proc.stdout.on("data", function(data){
    console.log(data.toString().replace(/\n/,""));
    if((ret = myArr.pop()) != undefined) proc.stdin.write(ret.toString() + "\n");
})