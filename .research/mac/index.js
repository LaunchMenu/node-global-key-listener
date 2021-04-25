/*
 *  Summary:
 *    Mac Virtual keycodes
 *  
 *  Discussion:
 *    These constants are the virtual keycodes defined originally in
 *    Inside Mac Volume V, pg. V-191. They identify physical keys on a
 *    keyboard. Those constants with "ANSI" in the name are labeled
 *    according to the key position on an ANSI-standard US keyboard.
 *    For example, kVK_ANSI_A indicates the virtual keycode for the key
 *    with the letter 'A' in the US keyboard layout. Other keyboard
 *    layouts may have the 'A' key label on a different physical key;
 *    in this case, pressing 'A' will generate a different virtual
 *    keycode.
 */
var lookupVkeys = {
    /* keycodes for keys that are dependent of keyboard layout*/
    0x00:{_nameRaw: "kVK_ANSI_A", name: "A"},
    0x0B:{_nameRaw: "kVK_ANSI_B", name: "B"},
    0x08:{_nameRaw: "kVK_ANSI_C", name: "C"},
    0x02:{_nameRaw: "kVK_ANSI_D", name: "D"},
    0x0E:{_nameRaw: "kVK_ANSI_E", name: "E"},
    0x03:{_nameRaw: "kVK_ANSI_F", name: "F"},
    0x05:{_nameRaw: "kVK_ANSI_G", name: "G"},
    0x04:{_nameRaw: "kVK_ANSI_H", name: "H"},
    0x22:{_nameRaw: "kVK_ANSI_I", name: "I"},
    0x26:{_nameRaw: "kVK_ANSI_J", name: "J"},
    0x28:{_nameRaw: "kVK_ANSI_K", name: "K"},
    0x25:{_nameRaw: "kVK_ANSI_L", name: "L"},
    0x2E:{_nameRaw: "kVK_ANSI_M", name: "M"},
    0x2D:{_nameRaw: "kVK_ANSI_N", name: "N"},
    0x1F:{_nameRaw: "kVK_ANSI_O", name: "O"},
    0x23:{_nameRaw: "kVK_ANSI_P", name: "P"},
    0x0C:{_nameRaw: "kVK_ANSI_Q", name: "Q"},
    0x0F:{_nameRaw: "kVK_ANSI_R", name: "R"},
    0x01:{_nameRaw: "kVK_ANSI_S", name: "S"},
    0x11:{_nameRaw: "kVK_ANSI_T", name: "T"},
    0x20:{_nameRaw: "kVK_ANSI_U", name: "U"},
    0x09:{_nameRaw: "kVK_ANSI_V", name: "V"},
    0x0D:{_nameRaw: "kVK_ANSI_W", name: "W"},
    0x07:{_nameRaw: "kVK_ANSI_X", name: "X"},
    0x10:{_nameRaw: "kVK_ANSI_Y", name: "Y"},
    0x06:{_nameRaw: "kVK_ANSI_Z", name: "Z"},
    0x1D:{_nameRaw: "kVK_ANSI_0", name: "0"},
    0x12:{_nameRaw: "kVK_ANSI_1", name: "1"},
    0x13:{_nameRaw: "kVK_ANSI_2", name: "2"},
    0x14:{_nameRaw: "kVK_ANSI_3", name: "3"},
    0x15:{_nameRaw: "kVK_ANSI_4", name: "4"},
    0x17:{_nameRaw: "kVK_ANSI_5", name: "5"},
    0x16:{_nameRaw: "kVK_ANSI_6", name: "6"},
    0x1A:{_nameRaw: "kVK_ANSI_7", name: "7"},
    0x1C:{_nameRaw: "kVK_ANSI_8", name: "8"},
    0x19:{_nameRaw: "kVK_ANSI_9", name: "9"},
    0x18:{_nameRaw: "kVK_ANSI_Equal", name: "Equal"},
    0x1B:{_nameRaw: "kVK_ANSI_Minus", name: "Minus"},
    0x1E:{_nameRaw: "kVK_ANSI_RightBracket", name: "RightBracket"},
    0x21:{_nameRaw: "kVK_ANSI_LeftBracket", name: "LeftBracket"},
    0x27:{_nameRaw: "kVK_ANSI_Quote", name: "Quote"},
    0x29:{_nameRaw: "kVK_ANSI_Semicolon", name: "Semicolon"},
    0x2A:{_nameRaw: "kVK_ANSI_Backslash", name: "Backslash"},
    0x2B:{_nameRaw: "kVK_ANSI_Comma", name: "Comma"},
    0x2C:{_nameRaw: "kVK_ANSI_Slash", name: "Slash"},
    0x2F:{_nameRaw: "kVK_ANSI_Period", name: "Period"},
    0x32:{_nameRaw: "kVK_ANSI_Grave", name: "Grave"},
    0x41:{_nameRaw: "kVK_ANSI_KeypadDecimal", name: "KeypadDecimal"},
    0x43:{_nameRaw: "kVK_ANSI_KeypadMultiply", name: "KeypadMultiply"},
    0x45:{_nameRaw: "kVK_ANSI_KeypadPlus", name: "KeypadPlus"},
    0x47:{_nameRaw: "kVK_ANSI_KeypadClear", name: "KeypadClear"},
    0x4B:{_nameRaw: "kVK_ANSI_KeypadDivide", name: "KeypadDivide"},
    0x4C:{_nameRaw: "kVK_ANSI_KeypadEnter", name: "KeypadEnter"},
    0x4E:{_nameRaw: "kVK_ANSI_KeypadMinus", name: "KeypadMinus"},
    0x51:{_nameRaw: "kVK_ANSI_KeypadEquals", name: "KeypadEquals"},
    0x52:{_nameRaw: "kVK_ANSI_Keypad0", name: "Keypad0"},
    0x53:{_nameRaw: "kVK_ANSI_Keypad1", name: "Keypad1"},
    0x54:{_nameRaw: "kVK_ANSI_Keypad2", name: "Keypad2"},
    0x55:{_nameRaw: "kVK_ANSI_Keypad3", name: "Keypad3"},
    0x56:{_nameRaw: "kVK_ANSI_Keypad4", name: "Keypad4"},
    0x57:{_nameRaw: "kVK_ANSI_Keypad5", name: "Keypad5"},
    0x58:{_nameRaw: "kVK_ANSI_Keypad6", name: "Keypad6"},
    0x59:{_nameRaw: "kVK_ANSI_Keypad7", name: "Keypad7"},
    0x5B:{_nameRaw: "kVK_ANSI_Keypad8", name: "Keypad8"},
    0x5C:{_nameRaw: "kVK_ANSI_Keypad9", name: "Keypad9"},
    
    /* keycodes for keys that are independent of keyboard layout*/
    0x24:{_nameRaw: "kVK_Return", name: "Return"},
    0x30:{_nameRaw: "kVK_Tab", name: "Tab"},
    0x31:{_nameRaw: "kVK_Space", name: "Space"},
    0x33:{_nameRaw: "kVK_Delete", name: "Delete"},
    0x35:{_nameRaw: "kVK_Escape", name: "Escape"},
    0x37:{_nameRaw: "kVK_Command", name: "Command"},
    0x38:{_nameRaw: "kVK_Shift", name: "Shift"},
    0x39:{_nameRaw: "kVK_CapsLock", name: "CapsLock"},
    0x3A:{_nameRaw: "kVK_Option", name: "Option"},
    0x3B:{_nameRaw: "kVK_Control", name: "Control"},
    0x3C:{_nameRaw: "kVK_RightShift", name: "RightShift"},
    0x3D:{_nameRaw: "kVK_RightOption", name: "RightOption"},
    0x3E:{_nameRaw: "kVK_RightControl", name: "RightControl"},
    0x3F:{_nameRaw: "kVK_Function", name: "Function"},
    0x40:{_nameRaw: "kVK_F17", name: "F17"},
    0x48:{_nameRaw: "kVK_VolumeUp", name: "VolumeUp"},
    0x49:{_nameRaw: "kVK_VolumeDown", name: "VolumeDown"},
    0x4A:{_nameRaw: "kVK_Mute", name: "Mute"},
    0x4F:{_nameRaw: "kVK_F18", name: "F18"},
    0x50:{_nameRaw: "kVK_F19", name: "F19"},
    0x5A:{_nameRaw: "kVK_F20", name: "F20"},
    0x60:{_nameRaw: "kVK_F5", name: "F5"},
    0x61:{_nameRaw: "kVK_F6", name: "F6"},
    0x62:{_nameRaw: "kVK_F7", name: "F7"},
    0x63:{_nameRaw: "kVK_F3", name: "F3"},
    0x64:{_nameRaw: "kVK_F8", name: "F8"},
    0x65:{_nameRaw: "kVK_F9", name: "F9"},
    0x67:{_nameRaw: "kVK_F11", name: "F11"},
    0x69:{_nameRaw: "kVK_F13", name: "F13"},
    0x6A:{_nameRaw: "kVK_F16", name: "F16"},
    0x6B:{_nameRaw: "kVK_F14", name: "F14"},
    0x6D:{_nameRaw: "kVK_F10", name: "F10"},
    0x6F:{_nameRaw: "kVK_F12", name: "F12"},
    0x71:{_nameRaw: "kVK_F15", name: "F15"},
    0x72:{_nameRaw: "kVK_Help", name: "Help"},
    0x73:{_nameRaw: "kVK_Home", name: "Home"},
    0x74:{_nameRaw: "kVK_PageUp", name: "PageUp"},
    0x75:{_nameRaw: "kVK_ForwardDelete", name: "ForwardDelete"},
    0x76:{_nameRaw: "kVK_F4", name: "F4"},
    0x77:{_nameRaw: "kVK_End", name: "End"},
    0x78:{_nameRaw: "kVK_F2", name: "F2"},
    0x79:{_nameRaw: "kVK_PageDown", name: "PageDown"},
    0x7A:{_nameRaw: "kVK_F1", name: "F1"},
    0x7B:{_nameRaw: "kVK_LeftArrow", name: "LeftArrow"},
    0x7C:{_nameRaw: "kVK_RightArrow", name: "RightArrow"},
    0x7D:{_nameRaw: "kVK_DownArrow", name: "DownArrow"},
    0x7E:{_nameRaw: "kVK_UpArrow", name: "UpArrow"},

}

const spawn = require("child_process").spawn;
class MacKeyServer {
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
        this.proc = spawn("./detectKeys");
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



var v = new MacKeyServer
v.addListener(function(e){
    console.log(e.key.name,e.state);
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
