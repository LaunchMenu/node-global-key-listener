import {IGlobalKeyServer} from "./_types/IGlobalKeyServer";
import {ChildProcess, execFile} from "child_process";
import {IGlobalKeyEvent} from "./_types/IGlobalKeyEvent";
import {IGlobalKeyListenerRaw} from "./_types/IGlobalKeyListenerRaw";
import {WinGlobalKeyLookup} from "./_data/WinGlobalKeyLookup";
import Path from "path";
import {IWindowsConfig} from "./_types/IWindowsConfig";
import {isSpawnEventSupported} from "./isSpawnEventSupported";
const sPath = "../../bin/WinKeyServer.exe";

/** Use this class to listen to key events on Windows OS */
export class WinKeyServer implements IGlobalKeyServer {
    protected listener: IGlobalKeyListenerRaw;
    private proc: ChildProcess;

    protected config: IWindowsConfig;

    /**
     * Creates a new key server for windows
     * @param listener The callback to report key events to
     * @param windowsConfig The optional windows configuration
     */
    public constructor(listener: IGlobalKeyListenerRaw, config: IWindowsConfig = {}) {
        this.listener = listener;
        this.config = config;
    }

    /** Start the Key server and listen for keypresses */
    public async start() {
        const serverPath = this.config.serverPath || Path.join(__dirname, sPath);
        this.proc = execFile(serverPath, { maxBuffer: Infinity });
        if (this.config.onInfo)
            this.proc.stderr?.on("data", data => this.config.onInfo?.(data.toString()));
        if (this.config.onError) this.proc.on("close", this.config.onError);

        this.proc.stdout?.on("data", data => {
            const events = this._getEventData(data);
            for (let {event, eventId} of events) {
                const stopPropagation = !!this.listener(event);

                this.proc.stdin?.write(`${stopPropagation ? "1" : "0"},${eventId}\n`);
            }
        });

        return new Promise<void>((res, err) => {
            this.proc.on("error", err);

            if (isSpawnEventSupported()) this.proc.on("spawn", res);
            // A timed fallback if the spawn event is not supported
            else setTimeout(res, 200);
        });
    }

    /** Stop the Key server */
    public stop() {
        this.proc.stdout?.pause();
        this.proc.kill();
    }

    /**
     * Obtains a IGlobalKeyEvent from stdout buffer data
     * @param data Data from stdout
     * @returns The standardized key event data
     */
    protected _getEventData(data: any): {event: IGlobalKeyEvent; eventId: string}[] {
        const sData: string = data.toString();
        const lines = sData.trim().split(/\n/);
        return lines.map(line => {
            const lineData = line.replace(/\s+/, "");

            const [
                _mouseKeyboard,
                downUp,
                sKeyCode,
                sScanCode,
                sLocationX,
                sLocationY,
                eventId,
            ] = lineData.split(",");

            const isDown = downUp === 'DOWN';

            const keyCode = Number.parseInt(sKeyCode, 10);
            const scanCode = Number.parseInt(sScanCode, 10);

            const locationX = Number.parseFloat(sLocationX);
            const locationY = Number.parseFloat(sLocationY);

            const key = WinGlobalKeyLookup[keyCode];

            return {
                event: {
                    vKey: keyCode,
                    rawKey: key,
                    name: key?.standardName,
                    state: isDown ? "DOWN" : "UP",
                    scanCode: scanCode,
                    location: [ locationX, locationY ],
                    _raw: sData,
                },
                eventId,
            };
        });
    }
}
