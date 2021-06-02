/** Key server configuration that's Mac specific */
export type IMacConfig = {
    //TODO: onInfo - need to log stuff in the swift process
    /** A callback that's triggered with additional information from the keyhandler */
    onError?: {(errorCode: number | null): void};
};
