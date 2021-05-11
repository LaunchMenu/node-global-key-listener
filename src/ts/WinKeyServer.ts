import {IGlobalKeyServer} from "./_types/IGlobalKeyServer";
import {ChildProcessWithoutNullStreams, spawn} from "child_process";
import {IGlobalKeyEvent} from "./_types/IGlobalKeyEvent";
import {IGlobalKeyListenerRaw} from "./_types/IGlobalKeyListenerRaw";
import {WinGlobalKeyLookup} from "./_data/WinGlobalKeyLookup";
const sPath = "./bin/WinKeyServer.exe";

/** Use this class to listen to key events on Windows OS */
export class WinKeyServer implements IGlobalKeyServer {
    protected listener: IGlobalKeyListenerRaw;
    private proc: ChildProcessWithoutNullStreams;

    /**
     * Creates a new key server for windows
     * @param listener The callback to report key events to
     */
    public constructor(listener: IGlobalKeyListenerRaw) {
        this.listener = listener;
    }

    /** Start the Key server and listen for keypresses */
    public start() {
        this.proc = spawn(sPath);
        this.proc.stdout.on("data", data => {
            let event = this._getEventData(data);
            let stopPropagation = !!this.listener(event);

            //If we want to halt propagation send 1, else send 0
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
        let key = WinGlobalKeyLookup[vKey];
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
