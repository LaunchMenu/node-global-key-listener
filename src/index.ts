//const os = require('os');
import os from "os"
import { MacKeyServer } from "./ts/MacKeyServer"
import { WinKeyServer } from "./ts/WinKeyServer"
import { IGlobalKey } from "./ts/_types/IGlobalKey"
import { IGlobalKeyDownMap } from "./ts/_types/IGlobalKeyDownMap"
import { IGlobalKeyListener } from "./ts/_types/IGlobalKeyListener"
import { IGlobalKeyListenerRaw } from "./ts/_types/IGlobalKeyListenerRaw"
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
    protected keyServer: IGlobalKeyServer;
    protected listeners: Array<IGlobalKeyListener>;

    /** The underlying map of keys that are being held down */
    private readonly isDown: IGlobalKeyDownMap;

    constructor(){
        this.listeners = [];
        this.isDown={};
        switch(os.platform()){
            case "win32":
                this.keyServer = new WinKeyServer(this.baseListener);
                break;
            case "darwin":
                this.keyServer = new MacKeyServer(this.baseListener);
                break;
        }
    }

    /**
     * Add a global keyboard listener to the global keyboard listener server.
     * @param listener The listener to add to the global keyboard listener
     */
    public addListener(listener: IGlobalKeyListener){
        this.listeners.push(listener);
        if(this.listeners.length==1){
            this.start();
        }
    }
    
    /**
     * Remove a global keyboard listener from the global keyboard listener server.
     * @param listener The listener to remove from the global keyboard listener
     */
    public removeListener(listener: IGlobalKeyListener){
        const index = this.listeners.indexOf(listener);
        if(index!=-1){
            this.listeners.splice(index,1)
            if(this.listeners.length == 0){
                setTimeout(()=>{
                    if (this.listeners.length == 0) this.stop();
                },100);
            }
        }
    }

    public kill(){
        this.listeners = [];
        this.stop();
    }

    /** Start the key server */
    protected start(){
        this.keyServer.start();
    }

    /** Stop the key server */
    protected stop(){
        this.keyServer.stop();
    }

    /** The following listener is used to monitor which keys are being held down */
    private baseListener: IGlobalKeyListenerRaw = (event)=>{
        switch(event.state){
            case "DOWN":
                this.isDown[event.name] = true
                break
            case "UP":
                this.isDown[event.name] = false
                break
        }


        let stopPropagation = false;
        for (let onKey of this.listeners){
            //Forward event
            const res = onKey(event, this.isDown);
            
            //Handle catch data
            if (res instanceof Object){
                if(res.stopPropagation) stopPropagation = true;
                if(res.stopImmediatePropagation) break;
            } else if(res){
                stopPropagation = true;
            }
        }

        return stopPropagation;
    }
}