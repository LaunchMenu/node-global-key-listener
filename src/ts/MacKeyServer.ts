import {IGlobalKeyServer} from "./_types/IGlobalKeyServer";
import {ChildProcess, execFile} from "child_process";
import {IGlobalKeyListenerRaw} from "./_types/IGlobalKeyListenerRaw";
import {IGlobalKeyEvent} from "./_types/IGlobalKeyEvent";
import {MacGlobalKeyLookup} from "./_data/MacGlobalKeyLookup";
import Path from "path";
import {IMacConfig} from "./_types/IMacConfig";
import sudo from "sudo-prompt";
import {isSpawnEventSupported} from "./isSpawnEventSupported";
const sPath = "../../bin/MacKeyServer";

/** Use this class to listen to key events on Mac OS */
export class MacKeyServer implements IGlobalKeyServer {
    protected listener: IGlobalKeyListenerRaw;
    private proc: ChildProcess;
    private config: IMacConfig;

    private running = false;
    private restarting = false;

    /**
     * Creates a new key server for mac
     * @param listener The callback to report key events to
     * @param config Additional optional configuration for the server
     */
    constructor(listener: IGlobalKeyListenerRaw, config: IMacConfig = {}) {
        this.listener = listener;
        this.config = config;
    }

    /**
     * Start the Key server and listen for keypresses
     * @param skipPerms Whether to skip attempting to add permissions
     */
    public start(skipPerms?: boolean): Promise<void> {
        this.running = true;

        const serverPath = this.config.serverPath || Path.join(__dirname, sPath);

        this.proc = execFile(serverPath);
        if (this.config.onInfo)
            this.proc.stderr!.on("data", data => this.config.onInfo?.(data.toString()));
        const onError = this.config.onError;
        if (onError)
            this.proc.on("close", code => {
                if (!this.restarting && this.running) onError(code);
            });

        this.proc.stdout!.on("data", data => {
            const events = this._getEventData(data);
            for (let {event, eventId} of events) {
                const stopPropagation = !!this.listener(event);

                this.proc.stdin!.write(`${stopPropagation ? "1" : "0"},${eventId}\n`);
            }
        });

        return this.handleStartup(skipPerms ?? false);
    }

    /**
     * Deals with the startup process of the server, possibly adding perms if required and restarting
     * @param skipPerms Whether to skip attempting to add permissions
     */
    protected handleStartup(skipPerms: boolean): Promise<void> {
        return new Promise<void>((res, rej) => {
            let errored = false;
            const serverPath = this.config.serverPath || Path.join(__dirname, sPath);

            // If setup fails, try adding permissions
            this.proc.on("error", async err => {
                errored = true;
                if (skipPerms) {
                    rej(err);
                } else {
                    try {
                        this.restarting = true;
                        this.proc.kill();
                        await this.addPerms(serverPath);

                        // If the server was stopped in between, just act as if it was started successfully
                        if (!this.running) {
                            res();
                            return;
                        }

                        res(this.start(true));
                    } catch (e) {
                        rej(e);
                    } finally {
                        this.restarting = false;
                    }
                }
            });

            if (isSpawnEventSupported()) this.proc.on("spawn", res);
            // A timed fallback if the spawn event is not supported
            else
                setTimeout(() => {
                    if (!errored) res();
                }, 200);
        });
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
        this.running = false;
        this.proc.stdout!.pause();
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
            const arr = lineData.split(",");
            const vKey = parseInt(arr[0]);
            const key = MacGlobalKeyLookup[vKey];
            const keyDown = /DOWN/.test(arr[1]);
            const eventId = arr[2];
            return {
                event: {
                    vKey,
                    rawKey: key,
                    name: key?.standardName,
                    state: keyDown ? "DOWN" : "UP",
                    scanCode: vKey,
                    _raw: sData,
                },
                eventId,
            };
        });
    }
}
