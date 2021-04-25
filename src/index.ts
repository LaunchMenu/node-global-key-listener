//const os = require('os');
import os from "os"
import { MacKeyServer } from "./ts/MacKeyServer"
import { WinKeyServer } from "./ts/WinKeyServer"
import { IGlobalKeyServer } from "./ts/_types/IGlobalKeyServer"

export class GlobalKeyboardListener {
    /** The underlying keyServer used to listen and halt propagation of events */
    protected keyServer: IGlobalKeyServer
    
    /** The underlying map of keys that are being held down */
    private downMap: { [key: string]: boolean }
    
    /** The underlying map of keys that are being held down */
    public isDown(key: string): boolean {
        return this.downMap[key];
    }

    /**  */
    constructor(){
        switch(os.platform()){
            case "win32":
                this.keyServer = new WinKeyServer()
                break
            case "darwin":
                this.keyServer = new MacKeyServer()
                break
        }
    }
}