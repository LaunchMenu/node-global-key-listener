import {IGlobalKeyServer} from "./_types/IGlobalKeyServer";
import {ChildProcessWithoutNullStreams, spawn} from "child_process";
import {IGlobalKeyListenerRaw} from "./_types/IGlobalKeyListenerRaw";
import {IGlobalKeyEvent} from "./_types/IGlobalKeyEvent";
import {MacGlobalKeyLookup} from "./_data/MacGlobalKeyLookup";
const sPath = "./bin/MacKeyServer";

/** Use this class to listen to key events on Mac OS */
export class MacKeyServer implements IGlobalKeyServer {
    protected listener: IGlobalKeyListenerRaw;
    private proc: ChildProcessWithoutNullStreams;

    /**
     * Creates a new key server for mac
     * @param listener The callback to report key events to
     */
    constructor(listener: IGlobalKeyListenerRaw) {
        this.listener = listener;
    }

    /** Start the Key server and listen for keypresses */
    public start() {
        this.proc = spawn(sPath);
        this.proc.stdout.on("data", data => {
            let event = this._getEventData(data);
            let stopPropagation = !!this.listener(event);

            //If we want to halt propogation send 1, else send 0
            this.proc.stdin.write((stopPropagation ? "1" : "0") + "\n");
        });
    }

    /** Stop the Key server */
    public stop() {
        this.proc.stdout.pause();
        this.proc.kill();
    }

    /**
     * Obtains a IGlobalKeyEvent from stdout buffer data
     * @param data Data from stdout
     * @returns The standardized key event
     */
    protected _getEventData(data: any): IGlobalKeyEvent {
        let sData = data.toString().replace(/\s+/, "");
        let arr = sData.split(",");
        let vKey = parseInt(arr[0]);
        let key = MacGlobalKeyLookup[vKey];
        let keyDown = /DOWN/.test(arr[1]);
        let scanCode = parseInt(arr[2]);
        return {
            vKey,
            rawKey: key,
            name: key?.standardName,
            state: keyDown ? "DOWN" : "UP",
            scanCode,
            _raw: sData,
        } as IGlobalKeyEvent;
    }
}
