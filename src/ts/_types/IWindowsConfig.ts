/** Key server configuration that's windows specific */
export type IWindowsConfig = {
    /** Whether they windows key up event should be captured, if windows + some key was captured before before releasing the windows key */
    captureWindowsKeyUp?: boolean;
};
