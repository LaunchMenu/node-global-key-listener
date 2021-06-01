import {IGlobalKeyServer} from "./_types/IGlobalKeyServer";
import {ChildProcessWithoutNullStreams, spawn} from "child_process";
import {IGlobalKeyListenerRaw} from "./_types/IGlobalKeyListenerRaw";
import {IGlobalKeyEvent} from "./_types/IGlobalKeyEvent";
import {MacGlobalKeyLookup} from "./_data/MacGlobalKeyLookup";
import Path from "path";
import {IMacConfig} from "./_types/IMacConfig";
import sudo from "sudo-prompt";
const sPath = "../../bin/MacKeyServer";

/** Use this class to listen to key events on Mac OS */
export class MacKeyServer implements IGlobalKeyServer {
    protected listener: IGlobalKeyListenerRaw;
    private proc: ChildProcessWithoutNullStreams;
    private config: IMacConfig;

    /**
     * Creates a new key server for mac
     * @param listener The callback to report key events to
     * @param config Additional optional configuration for the server
     */
    constructor(listener: IGlobalKeyListenerRaw, config: IMacConfig = {}) {
        this.listener = listener;
        this.config = config;
    }

    /** Start the Key server and listen for keypresses */
    public start() {
        const path = Path.join(__dirname, sPath);
        let addedPerms = false;
        const setup = () => {
            this.proc = spawn(path);
            //TODO:: `if (this.config.onInfo) this.proc.stderr.on("data", data => this.config.onInfo?.(data.toString()));`  - use stderr to log info in main process?
            if (this.config.onError) this.proc.on("close", this.config.onError);
            this.proc.stdout.on("data", data => {
                const events = this._getEventData(data);
                for (let event of events) {
                    const stopPropagation = !!this.listener(event);

                    this.proc.stdin.write((stopPropagation ? "1" : "0") + "\n");
                }
            });

            // If setup fails, try adding permissions
            if (!addedPerms)
                this.proc.on("error", async err => {
                    addedPerms = true;
                    this.proc.kill();
                    try {
                        await this.addPerms(path);
                        setup();
                    } catch (e) {
                        if (this.config.onError) this.config.onError(e);
                        else console.error(e);
                    }
                });
        };
        setup();
    }

    /**
     * Makes sure that the given path is executable
     * @param path The path to add the perms to
     */
    protected addPerms(path: string): Promise<void> {
        const options = {
            name: "Global key listener",
        };
        return new Promise((res, err) => {
            sudo.exec(`chmod +x "${path}"`, options, (error, stdout, stderr) => {
                if (error) {
                    err(error);
                    return;
                }
                if (stderr) {
                    err(stderr);
                    return;
                }
                res();
            });
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
     * @returns The standardized key event data
     */
    protected _getEventData(data: any): IGlobalKeyEvent[] {
        const sData: string = data.toString();
        const lines = sData.trim().split(/\n/);
        return lines.map(line => {
            const lineData = line.replace(/\s+/, "");
            const arr = lineData.split(",");
            const vKey = parseInt(arr[0]);
            const key = MacGlobalKeyLookup[vKey];
            const keyDown = /DOWN/.test(arr[1]);
            const scanCode = parseInt(arr[2]);
            return {
                vKey,
                rawKey: key,
                name: key?.standardName,
                state: keyDown ? "DOWN" : "UP",
                scanCode,
                _raw: sData,
            };
        });
    }
}
