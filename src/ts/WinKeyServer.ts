import { IGlobalKeyServer } from "./_types/IGlobalKeyServer";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { IGlobalKeyEvent } from "./_types/IGlobalKeyEvent";
import { IGlobalKeyListenerRaw } from "./_types/IGlobalKeyListenerRaw";
import { WinGlobalKeyLookup } from "./_data/WinGlobalKeyLookup";
import Path from "path";
import { IWindowsConfig } from "./_types/IWindowsConfig";
const sPath = "../../bin/WinKeyServer.exe";

/** Use this class to listen to key events on Windows OS */
export class WinKeyServer implements IGlobalKeyServer {
    protected listener: IGlobalKeyListenerRaw;
    private proc: ChildProcessWithoutNullStreams;

    // Meta release handling
    protected captureWindowsKeyUp: boolean;
    protected isMetaDown = false;
    protected captureMetaUp = false;
    protected config: IWindowsConfig;

    /**
     * Creates a new key server for windows
     * @param listener The callback to report key events to
     * @param windowsConfig The optional windows configuration
     */
    public constructor(
        listener: IGlobalKeyListenerRaw,
        config: IWindowsConfig = {}
    ) {
        this.listener = listener;
        this.config = config;
    }

    /** Start the Key server and listen for keypresses */
    public start() {
        this.proc = spawn(Path.join(__dirname, sPath));
        if (this.config.onInfo) this.proc.stderr.on("data", data => this.config.onInfo?.(data.toString()));
        if (this.config.onError) this.proc.on("close", this.config.onError);

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
