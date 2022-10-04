import {IGlobalKey} from "./IGlobalKey";

export type IGlobalKeyLookup = {
    [key: number]: undefined | {_nameRaw: string; name: string; standardName?: IGlobalKey};
};
