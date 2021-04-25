//const os = require('os');
import os from "os"
import { MacKeyServer } from "./ts/MacKeyServer"
import { WinKeyServer } from "./ts/WinKeyServer"
import { IGlobalKeyListener } from "./ts/_types/IGlobalKeyListener"
import { IGlobalKeyServer } from "./ts/_types/IGlobalKeyServer"


/**
 * A cross-platform global keyboard listener. Ideal for setting up global keyboard shortcuts
 * and key-loggers (usually for automation).
 * This keyserver uses low-level hooks on Windows OS and Event Taps on Mac OS, which allows
 * event propagation to be halted to the rest of the operating system as well as allowing
 * any key to be used for shortcuts.
 */
export class GlobalKeyboardListener {
    /** The underlying keyServer used to listen and halt propagation of events */
    protected keyServer: IGlobalKeyServer
    protected listenerCount: number

    /** The underlying map of keys that are being held down */
    private downMap: { [key: string]: boolean }

    constructor(){
        this.listenerCount = 0;
        switch(os.platform()){
            case "win32":
                this.keyServer = new WinKeyServer()
                break
            case "darwin":
                this.keyServer = new MacKeyServer()
                break
        }
    }

    /**
     * Add a global keyboard listener to the global keyboard listener server.
     * @param listener The listener to add to the global keyboard listener
     */
    public addListener(listener: IGlobalKeyListener){
        if(this.listenerCount==0) this.init()
        this.keyServer.addListener(listener);
        this.listenerCount++
    }
    
    /**
     * Remove a global keyboard listener from the global keyboard listener server.
     * @param listener The listener to remove from the global keyboard listener
     */
    public removeListener(listener: IGlobalKeyListener){
        this.keyServer.removeListener(listener)
        this.listenerCount--
        if(this.listenerCount==0) this.exit()
    }

    /** The underlying map of keys that are being held down */
    public isDown(key: string): boolean {
        return !!this.downMap[key];
    }

    /** Start the key server */
    public start(){
        this.keyServer.start();
        if(this.listenerCount==0 && this.keyServer.count()==0) this.init();
    }

    /** Stop the key server */
    public stop(){
        this.keyServer.stop();
    }

    /** Initialise / start the key server, initialising base listeners etc */
    protected init(){
        this.keyServer.addListener(this.baseListener)
    }

    /** Destroy / stop the key server, removing base listeners etc */
    protected exit(){
        this.keyServer.removeListener(this.baseListener)
    }

    /** The following listener is used to monitor which keys are being held down */
    private baseListener: IGlobalKeyListener = function(e){
        switch(e.state){
            case "DOWN":
                this.downMap[e.key.name] = true
                break
            case "UP":
                this.downMap[e.key.name] = false
                break
        }
    }
}