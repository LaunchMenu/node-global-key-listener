import { IMacConfig } from "./IMacConfig";
import { IWindowsConfig } from "./IWindowsConfig";

/** Key listener configuration */
export type IConfig = {
    /** The windows key server configuration */
    windows?: IWindowsConfig;
    /** The mac key server configuration */
    mac?: IMacConfig;
};