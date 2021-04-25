//Keycodes taken from here:
//https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
var lookupVkeys = {
    0x30: {_nameRaw:"VK_0", name: "0"},
    0x31: {_nameRaw:"VK_1", name: "1"},
    0x32: {_nameRaw:"VK_2", name: "2"},
    0x33: {_nameRaw:"VK_3", name: "3"},
    0x34: {_nameRaw:"VK_4", name: "4"},
    0x35: {_nameRaw:"VK_5", name: "5"},
    0x36: {_nameRaw:"VK_6", name: "6"},
    0x37: {_nameRaw:"VK_7", name: "7"},
    0x38: {_nameRaw:"VK_8", name: "8"},
    0x39: {_nameRaw:"VK_9", name: "9"},
    0x41: {_nameRaw:"VK_A", name: "A"},
    0x42: {_nameRaw:"VK_B", name: "B"},
    0x43: {_nameRaw:"VK_C", name: "C"},
    0x44: {_nameRaw:"VK_D", name: "D"},
    0x45: {_nameRaw:"VK_E", name: "E"},
    0x46: {_nameRaw:"VK_F", name: "F"},
    0x47: {_nameRaw:"VK_G", name: "G"},
    0x48: {_nameRaw:"VK_H", name: "H"},
    0x49: {_nameRaw:"VK_I", name: "I"},
    0x4A: {_nameRaw:"VK_J", name: "J"},
    0x4B: {_nameRaw:"VK_K", name: "K"},
    0x4C: {_nameRaw:"VK_L", name: "L"},
    0x4D: {_nameRaw:"VK_M", name: "M"},
    0x4E: {_nameRaw:"VK_N", name: "N"},
    0x4F: {_nameRaw:"VK_O", name: "O"},
    0x50: {_nameRaw:"VK_P", name: "P"},
    0x51: {_nameRaw:"VK_Q", name: "Q"},
    0x52: {_nameRaw:"VK_R", name: "R"},
    0x53: {_nameRaw:"VK_S", name: "S"},
    0x54: {_nameRaw:"VK_T", name: "T"},
    0x55: {_nameRaw:"VK_U", name: "U"},
    0x56: {_nameRaw:"VK_V", name: "V"},
    0x57: {_nameRaw:"VK_W", name: "W"},
    0x58: {_nameRaw:"VK_X", name: "X"},
    0x59: {_nameRaw:"VK_Y", name: "Y"},
    0x5A: {_nameRaw:"VK_Z", name: "Z"},
    0x01: {_nameRaw:"VK_LBUTTON", name: "LBUTTON"},
    0x02: {_nameRaw:"VK_RBUTTON", name: "RBUTTON"},
    0x03: {_nameRaw:"VK_CANCEL", name: "CANCEL"},
    0x04: {_nameRaw:"VK_MBUTTON", name: "MBUTTON"},
    0x05: {_nameRaw:"VK_XBUTTON1", name: "XBUTTON1"},
    0x06: {_nameRaw:"VK_XBUTTON2", name: "XBUTTON2"},
    0x08: {_nameRaw:"VK_BACK", name: "BACK"},
    0x09: {_nameRaw:"VK_TAB", name: "TAB"},
    0x0C: {_nameRaw:"VK_CLEAR", name: "CLEAR"},
    0x0D: {_nameRaw:"VK_RETURN", name: "RETURN"},
    0x10: {_nameRaw:"VK_SHIFT", name: "SHIFT"},
    0x11: {_nameRaw:"VK_CONTROL", name: "CONTROL"},
    0x12: {_nameRaw:"VK_MENU", name: "MENU"},
    0x13: {_nameRaw:"VK_PAUSE", name: "PAUSE"},
    0x14: {_nameRaw:"VK_CAPITAL", name: "CAPSLOCK"},
    0x15: {_nameRaw:"VK_KANA", name: "KANA"},
    0x15: {_nameRaw:"VK_HANGUEL", name: "HANGUEL"},
    0x15: {_nameRaw:"VK_HANGUL", name: "HANGUL"},
    0x16: {_nameRaw:"VK_IME_ON", name: "IME_ON"},
    0x17: {_nameRaw:"VK_JUNJA", name: "JUNJA"},
    0x18: {_nameRaw:"VK_FINAL", name: "FINAL"},
    0x19: {_nameRaw:"VK_HANJA", name: "HANJA"},
    0x19: {_nameRaw:"VK_KANJI", name: "KANJI"},
    0x1A: {_nameRaw:"VK_IME_OFF", name: "IME_OFF"},
    0x1B: {_nameRaw:"VK_ESCAPE", name: "ESCAPE"},
    0x1C: {_nameRaw:"VK_CONVERT", name: "CONVERT"},
    0x1D: {_nameRaw:"VK_NONCONVERT", name: "NONCONVERT"},
    0x1E: {_nameRaw:"VK_ACCEPT", name: "ACCEPT"},
    0x1F: {_nameRaw:"VK_MODECHANGE", name: "MODECHANGE"},
    0x20: {_nameRaw:"VK_SPACE", name: "SPACE"},
    0x21: {_nameRaw:"VK_PRIOR", name: "PRIOR"},
    0x22: {_nameRaw:"VK_NEXT", name: "NEXT"},
    0x23: {_nameRaw:"VK_END", name: "END"},
    0x24: {_nameRaw:"VK_HOME", name: "HOME"},
    0x25: {_nameRaw:"VK_LEFT", name: "LEFT"},
    0x26: {_nameRaw:"VK_UP", name: "UP"},
    0x27: {_nameRaw:"VK_RIGHT", name: "RIGHT"},
    0x28: {_nameRaw:"VK_DOWN", name: "DOWN"},
    0x29: {_nameRaw:"VK_SELECT", name: "SELECT"},
    0x2A: {_nameRaw:"VK_PRINT", name: "PRINT"},
    0x2B: {_nameRaw:"VK_EXECUTE", name: "EXECUTE"},
    0x2C: {_nameRaw:"VK_SNAPSHOT", name: "SNAPSHOT"},
    0x2D: {_nameRaw:"VK_INSERT", name: "INSERT"},
    0x2E: {_nameRaw:"VK_DELETE", name: "DELETE"},
    0x2F: {_nameRaw:"VK_HELP", name: "HELP"},
    0x5B: {_nameRaw:"VK_LWIN", name: "LWIN"},
    0x5C: {_nameRaw:"VK_RWIN", name: "RWIN"},
    0x5D: {_nameRaw:"VK_APPS", name: "APPS"},
    0x5F: {_nameRaw:"VK_SLEEP", name: "SLEEP"},
    0x60: {_nameRaw:"VK_NUMPAD0", name: "NUMPAD0"},
    0x61: {_nameRaw:"VK_NUMPAD1", name: "NUMPAD1"},
    0x62: {_nameRaw:"VK_NUMPAD2", name: "NUMPAD2"},
    0x63: {_nameRaw:"VK_NUMPAD3", name: "NUMPAD3"},
    0x64: {_nameRaw:"VK_NUMPAD4", name: "NUMPAD4"},
    0x65: {_nameRaw:"VK_NUMPAD5", name: "NUMPAD5"},
    0x66: {_nameRaw:"VK_NUMPAD6", name: "NUMPAD6"},
    0x67: {_nameRaw:"VK_NUMPAD7", name: "NUMPAD7"},
    0x68: {_nameRaw:"VK_NUMPAD8", name: "NUMPAD8"},
    0x69: {_nameRaw:"VK_NUMPAD9", name: "NUMPAD9"},
    0x6A: {_nameRaw:"VK_MULTIPLY", name: "MULTIPLY"},
    0x6B: {_nameRaw:"VK_ADD", name: "ADD"},
    0x6C: {_nameRaw:"VK_SEPARATOR", name: "SEPARATOR"},
    0x6D: {_nameRaw:"VK_SUBTRACT", name: "SUBTRACT"},
    0x6E: {_nameRaw:"VK_DECIMAL", name: "DECIMAL"},
    0x6F: {_nameRaw:"VK_DIVIDE", name: "DIVIDE"},
    0x70: {_nameRaw:"VK_F1", name: "F1"},
    0x71: {_nameRaw:"VK_F2", name: "F2"},
    0x72: {_nameRaw:"VK_F3", name: "F3"},
    0x73: {_nameRaw:"VK_F4", name: "F4"},
    0x74: {_nameRaw:"VK_F5", name: "F5"},
    0x75: {_nameRaw:"VK_F6", name: "F6"},
    0x76: {_nameRaw:"VK_F7", name: "F7"},
    0x77: {_nameRaw:"VK_F8", name: "F8"},
    0x78: {_nameRaw:"VK_F9", name: "F9"},
    0x79: {_nameRaw:"VK_F10", name: "F10"},
    0x7A: {_nameRaw:"VK_F11", name: "F11"},
    0x7B: {_nameRaw:"VK_F12", name: "F12"},
    0x7C: {_nameRaw:"VK_F13", name: "F13"},
    0x7D: {_nameRaw:"VK_F14", name: "F14"},
    0x7E: {_nameRaw:"VK_F15", name: "F15"},
    0x7F: {_nameRaw:"VK_F16", name: "F16"},
    0x80: {_nameRaw:"VK_F17", name: "F17"},
    0x81: {_nameRaw:"VK_F18", name: "F18"},
    0x82: {_nameRaw:"VK_F19", name: "F19"},
    0x83: {_nameRaw:"VK_F20", name: "F20"},
    0x84: {_nameRaw:"VK_F21", name: "F21"},
    0x85: {_nameRaw:"VK_F22", name: "F22"},
    0x86: {_nameRaw:"VK_F23", name: "F23"},
    0x87: {_nameRaw:"VK_F24", name: "F24"},
    0x90: {_nameRaw:"VK_NUMLOCK", name: "NUMLOCK"},
    0x91: {_nameRaw:"VK_SCROLL", name: "SCROLL"},
    0xA0: {_nameRaw:"VK_LSHIFT", name: "LSHIFT"},
    0xA1: {_nameRaw:"VK_RSHIFT", name: "RSHIFT"},
    0xA2: {_nameRaw:"VK_LCONTROL", name: "LCONTROL"},
    0xA3: {_nameRaw:"VK_RCONTROL", name: "RCONTROL"},
    0xA4: {_nameRaw:"VK_LMENU", name: "LALT"},
    0xA5: {_nameRaw:"VK_RMENU", name: "RALT"},
    0xA6: {_nameRaw:"VK_BROWSER_BACK", name: "BROWSER_BACK"},
    0xA7: {_nameRaw:"VK_BROWSER_FORWARD", name: "BROWSER_FORWARD"},
    0xA8: {_nameRaw:"VK_BROWSER_REFRESH", name: "BROWSER_REFRESH"},
    0xA9: {_nameRaw:"VK_BROWSER_STOP", name: "BROWSER_STOP"},
    0xAA: {_nameRaw:"VK_BROWSER_SEARCH", name: "BROWSER_SEARCH"},
    0xAB: {_nameRaw:"VK_BROWSER_FAVORITES", name: "BROWSER_FAVORITES"},
    0xAC: {_nameRaw:"VK_BROWSER_HOME", name: "BROWSER_HOME"},
    0xAD: {_nameRaw:"VK_VOLUME_MUTE", name: "VOLUME_MUTE"},
    0xAE: {_nameRaw:"VK_VOLUME_DOWN", name: "VOLUME_DOWN"},
    0xAF: {_nameRaw:"VK_VOLUME_UP", name: "VOLUME_UP"},
    0xB0: {_nameRaw:"VK_MEDIA_NEXT_TRACK", name: "MEDIA_NEXT_TRACK"},
    0xB1: {_nameRaw:"VK_MEDIA_PREV_TRACK", name: "MEDIA_PREV_TRACK"},
    0xB2: {_nameRaw:"VK_MEDIA_STOP", name: "MEDIA_STOP"},
    0xB3: {_nameRaw:"VK_MEDIA_PLAY_PAUSE", name: "MEDIA_PLAY_PAUSE"},
    0xB4: {_nameRaw:"VK_LAUNCH_MAIL", name: "LAUNCH_MAIL"},
    0xB5: {_nameRaw:"VK_LAUNCH_MEDIA_SELECT", name: "LAUNCH_MEDIA_SELECT"},
    0xB6: {_nameRaw:"VK_LAUNCH_APP1", name: "LAUNCH_APP1"},
    0xB7: {_nameRaw:"VK_LAUNCH_APP2", name: "LAUNCH_APP2"},
    0xBA: {_nameRaw:"VK_OEM_1", name: "OEM_1"},
    0xBB: {_nameRaw:"VK_OEM_PLUS", name: "OEM_PLUS"},
    0xBC: {_nameRaw:"VK_OEM_COMMA", name: "OEM_COMMA"},
    0xBD: {_nameRaw:"VK_OEM_MINUS", name: "OEM_MINUS"},
    0xBE: {_nameRaw:"VK_OEM_PERIOD", name: "OEM_PERIOD"},
    0xBF: {_nameRaw:"VK_OEM_2", name: "OEM_2"},
    0xC0: {_nameRaw:"VK_OEM_3", name: "OEM_3"},
    0xDB: {_nameRaw:"VK_OEM_4", name: "OEM_4"},
    0xDC: {_nameRaw:"VK_OEM_5", name: "OEM_5"},
    0xDD: {_nameRaw:"VK_OEM_6", name: "OEM_6"},
    0xDE: {_nameRaw:"VK_OEM_7", name: "OEM_7"},
    0xDF: {_nameRaw:"VK_OEM_8", name: "OEM_8"},
    0xE2: {_nameRaw:"VK_OEM_102", name: "OEM_102"},
    0xE5: {_nameRaw:"VK_PROCESSKEY", name: "PROCESSKEY"},
    0xE7: {_nameRaw:"VK_PACKET", name: "PACKET"},
    0xF6: {_nameRaw:"VK_ATTN", name: "ATTN"},
    0xF7: {_nameRaw:"VK_CRSEL", name: "CRSEL"},
    0xF8: {_nameRaw:"VK_EXSEL", name: "EXSEL"},
    0xF9: {_nameRaw:"VK_EREOF", name: "EREOF"},
    0xFA: {_nameRaw:"VK_PLAY", name: "PLAY"},
    0xFB: {_nameRaw:"VK_ZOOM", name: "ZOOM"},
    0xFC: {_nameRaw:"VK_NONAME", name: "NONAME"},
    0xFD: {_nameRaw:"VK_PA1", name: "PA1"},
    0xFE: {_nameRaw:"VK_OEM_CLEAR", name: "OEM_CLEAR"}
}

const spawn = require("child_process").spawn;
class WindowsKeyServer {
    constructor(){
        this.listeners = [];
    }
    addListener(listener){
        this.listeners.push(listener);
        if(this.listeners.length==1){
            this.start()
        }
    }
    removeListener(listener){
        const index = this.listeners.indexOf(listener);
        if(index!=-1){
            this.listeners.splice(index,1)
            if(this.listeners.length == 0){
                setTimeout(()=>{
                    if (this.listeners.length == 0) this.stop();
                },100)
            }
        }
    }
    start(){
        this.proc = spawn("detectKeys.exe");
        this.proc.stdout.on("data", (data)=>{
            let event = this._getEventData(data);
            let stopPropagation = false;
            for (let onKey of this.listeners){
                //Forward event
                const res = onKey(event)
                
                //Handle catch data
                if (res instanceof Object){
                    if(res.stopPropagation) stopPropagation = true;
                    if(res.stopImmediatePropagation) break;
                } else if(res){
                    stopPropagation = true;
                }
            }
            
            //If we want to halt propogation send 1, else send 0
            this.proc.stdin.write((stopPropagation ? "1" : "0") + "\n");
        });
    }
    stop(){
        this.proc.stdout.pause();
        this.proc.kill();
    }
    _getEventData(data){
        let sdata = data.toString().replace(/\s+/,"");
        let arr = sdata.split(",");
        let vkey = parseInt(arr[0]);
        let key = lookupVkeys[vkey];
        let keyDown = /DOWN/.test(arr[1]);
        let scanCode = parseInt(arr[2]);
        return {
            vkey,
            key,
            state: keyDown ? "DOWN": "UP",
            scanCode,
            _raw: sdata
        }
    }
}



var v = new WindowsKeyServer
v.addListener(function(e){
    console.log(e.key.name);
})
v.addListener(function(e){
    if (e.key.name == "A"){
        console.log("Halt A")
        return true;
    }
})
v.addListener(function(e){
    if(e.key.name == "S"){
        console.log("Halt S")
        return {stopPropagation: true};
    }
})
v.addListener(function(e){
    if(e.key.name == "D"){
        console.log("Halt D Immediate")
        return {stopImmediatePropagation: true};
    }
    
})
v.addListener(function(e){
    if(e.key.name == "D"){
        console.log("This shouldn't call D")
        return {stopImmediatePropagation: e.key.name == "D"};
    }
})

v.addListener(function(e){
    if(e.key.name == "B"){
        v.stop()
    }
})
