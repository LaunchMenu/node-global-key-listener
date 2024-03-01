/*
Description:
  This swift module creates a `CGEventTap` using `CGEvent.tapCreate` and `CGEventTapCallback` to intercept
  events before they reach other applications on the operating system. Event handling is offloaded to the
  calling process. The calling process is to decide whether the events should be caught or propogated.

  The key information sent to the main process is like:
    4,DOWN,1
    4,UP,2
    14,DOWN,3
    14,UP,4
    37,DOWN,5
    37,UP,6
    37,DOWN,7
    37,UP,8
    31,DOWN,9
    31,UP,10
  when `hello` is typed. If `H` is held down for a long period of time, DOWN events are repeated until released.
    4,DOWN,1
    4,DOWN,2
    4,DOWN,3
    4,DOWN,4
    4,DOWN,5
    4,DOWN,6
    4,UP,7
  
  The calling process should send "1,{id}\n" if it wants the tap to block the keypress and "0,{id}\n"
  if it wants the tap to propogate the keypress to the rest of the system (where {id} is the integer id received).

Notes:

  * If you don't respond to a CGEventTap within a certain amount of time (undocumented) the OS will forcefully remove
  you Event Tap. In order to accommodate for this timeout, our process requires all keystrokes to respond within 30ms
  of dispatch. If your process does not respond within 30ms the event will be propogated to the rest of the system.
  * When CGEvent Tap times out it will receive a CGEventType.tapDisabledByTimeout message which will cause this software
  to send a `Timeout error raised on key listener` message to stderr. This should never happen if the timeout system
  in place is correct.
  * The specific timeout time is declared in the `timeoutTime` global variable.

Compilation:

  `swiftc main.swift -o detectKeys`


Other examples of usage of event taps:

  https://gitlab.com/casual-programmer/eventmonitor/-/blob/master/Sources/EventMonitor/EventMonitor.swift
*/


//External imports
import Swift
import Darwin.C

//Import of CGEvent, CGEventTapProxy, CGEventType, CGEvent, ...
import Foundation

// How long to wait before timing out a key response
let timeoutTime: Int64 = 30;

let VK_LCOMMAND : Int64 = 0x37;
let VK_RCOMMAND : Int64 = 0x36;
let VK_LSHIFT   : Int64 = 0x38;
let VK_RSHIFT   : Int64 = 0x3C;
let VK_LALT     : Int64 = 0x3A;
let VK_RALT     : Int64 = 0x3D;
let VK_LCTRL    : Int64 = 0x3B;
let VK_RCTRL    : Int64 = 0x3E;
let VK_CAPSLOCK : Int64 = 0x39;
let VK_FN       : Int64 = 0x3F;
let VK_HELP     : Int64 = 0x12;

/*
  If you don't respond to a CGEventTap within a certain amount of time (undocumented)
  the OS will forcefully remove you Event Tap. In order to prevent this, we implement a custom
  30ms timeout on all propogation requests.

  We use the following variables to do this.
 */
let signalMutex = DispatchSemaphore(value: 1);
let requestTimeoutSemaphore = DispatchSemaphore(value: 0);
let responseSemaphore = DispatchSemaphore(value: 0);
var requestTime: Int64 = 0;
var responseId: Int64 = 0;
var timeoutId: Int64 = 0;
var curId: Int64 = 0;
var output: String = "";

/**
 * getMillis
 * Obtain milliseconds since 1970.
 * @returns Milliseconds since 1970
 */
func getMillis() -> Int64 {
    return Int64(NSDate().timeIntervalSince1970 * 1000);
}

/**
 * haltPropogation
 * Communicates key information with the calling process to identify whether the key event should
 * be propogated to the rest of the OS.
 * @param key    - The key code pressed.
 * @param isDown - true, if a keydown event occurred, false otherwise.
 * @returns Whether the event should be propogated or not.
 * @remark Sends a comma delimited string of the form "keyCode,DOWN,eventID"  or "keyCode,UP,eventID".
 *  Expects "1\n" (halt propogation of event) or "0\n" (do not halt propogation of event)
 * @remark This function timeouts after  30ms and returns false in order to propogate the event to the rest of the OS.
 */
func haltPropogation(
  isMouse: Bool,
  isDown: Bool,
  keyCode: Int64,
  location: (Double, Double)
) -> Bool {
    curId = curId + 1;
    print("\(isMouse ? "MOUSE" : "KEYBOARD"),\(isDown ? "DOWN" : "UP"),\(keyCode),\(location.0),\(location.1),\(curId)");
    fflush(stdout);

    // Indicate when the next timeout should occur
    requestTime = getMillis() + timeoutTime
    requestTimeoutSemaphore.signal();

    // Wait for any response 
    responseSemaphore.wait();

    return output == "1";
}

/**
 *  Synchronously reads a line from the stdin and tries to report the result to the haltPropogation function (if it hasn't
 *  timed out already)
 */
func checkInputLoop() -> Void {
    while(true) {
        // Retrieve input and extract the code
        // Readlone can return nil if EOF is reached (which it doesn't as we are reading stdin).
        guard let line: String = readLine(strippingNewline: true) else {return;};
        let parts = line.components(separatedBy: ",")
        let code = parts[0];
        let id = Int64(parts[1]) ?? 0;

        // Lock the signalling, making sure the timeout doesn't signal it's response yet
        signalMutex.wait();
        if(timeoutId < id) {
            // Set the output and signal that there is a response
            responseId = id;
            output = code;
            responseSemaphore.signal();
        }
        signalMutex.signal();
    }
}

/**
 * Synchronously waits until a timeout occurs and reports this to the haltPropogation function if it hasn't received a response
 * yet.
 */
func timeoutLoop() -> Void {
    while(true) {
        // Wait for a timeout to be requested 
        requestTimeoutSemaphore.wait();

        // Calculate how long to sleep in order to wake up at the requested time and start sleeping
        let sleepDuration = requestTime - getMillis();
        if(sleepDuration>0) {
            usleep(UInt32(sleepDuration)*1000);
        }

        // Lock the signalling, making sure the input signalling can't happen before we finished here
        signalMutex.wait();
        timeoutId = timeoutId+1;  
        if(responseId < timeoutId) {
            // Set the output to 0 and signal that there is a response
            output="0";
            responseSemaphore.signal();
        } 
        signalMutex.signal();           
    }
}

/**
 * Prints to stderr for error reporting purposes
 * @param data - Text data to log to stderr
 */
func logErr(_ data: String) -> Void {
  fputs("\(data)\n",stderr);
  fflush(stderr)
}

/**
 * Returns true if key event passed is a onDown message otherwise returns false. This helps us create the isDown param for
 * haltPropogation
 * @param event - Key event received
 * @param keyCode - scanCode of the key pressed
 * @returns True if key is down message, false if key is up message
 */
func getModifierDownState(event: CGEvent, keyCode: Int64) -> Bool {
    switch keyCode {
        case VK_LCOMMAND, VK_RCOMMAND:
            return event.flags.contains(.maskCommand);
        case VK_LSHIFT, VK_RSHIFT:
            return event.flags.contains(.maskShift);
        case VK_LCTRL, VK_RCTRL:
            return event.flags.contains(.maskControl);
        case VK_LALT, VK_RALT:
            return event.flags.contains(.maskAlternate);
        case VK_CAPSLOCK:
            return event.flags.contains(.maskAlphaShift);
        case VK_FN:
            return event.flags.contains(.maskSecondaryFn);
        case VK_HELP:
            return event.flags.contains(.maskHelp);
        default:
            return false;
    }
}

/**
 * myCGEventTapCallback
 * [CGEventTapCallback](https://developer.apple.com/documentation/coregraphics/cgeventtapcallback) used by CGEvent.tapCreate
 * @remark returning nil from this callback destroys the event and stops it propogating to
 * other windows in the system, as required. If not captured the event should be returned and `passUnretained`.
 * @remark keyCodes can be found [here](https://stackoverflow.com/a/16125341).
 */
func myCGEventTapCallback(proxy: CGEventTapProxy, type: CGEventType, event: CGEvent, refcon: UnsafeMutableRawPointer?) -> Unmanaged<CGEvent>? {
    if [.keyDown , .keyUp].contains(type) {
        let keyCode = event.getIntegerValueField(.keyboardEventKeycode) //CGKeyCode
        if haltPropogation(
             isMouse: false,
             isDown: type == .keyDown,
             keyCode: keyCode,
             location: (0, 0)
           ) {
            return nil
        }

    } else if [.flagsChanged].contains(type) {
        //keycode is still available
        let keyCode = event.getIntegerValueField(.keyboardEventKeycode)
        let downState = getModifierDownState(event: event, keyCode: keyCode);
        if haltPropogation(
             isMouse: false,
             isDown: downState,
             keyCode: keyCode,
             location: (0, 0)
           ) {
            return nil
        }

    } else if [
                .leftMouseDown,
                .leftMouseUp,
                .rightMouseDown,
                .rightMouseUp,
                .otherMouseDown,
                .otherMouseUp,
              ].contains(type) {
        let isDown = [
          .leftMouseDown,
          .rightMouseDown,
          .otherMouseDown,
        ].contains(type)
        let keyCode = event.getIntegerValueField(.mouseEventButtonNumber)
        if haltPropogation(
             isMouse: true,
             isDown: isDown,
             keyCode: keyCode,
             location: (event.location.x, event.location.y)
           ) {
            return nil
        }

    } else if (type == CGEventType.tapDisabledByTimeout) {
        logErr("Timeout error raised on key listener");
        return nil
    }
    return Unmanaged.passUnretained(event)
}

//Define an event mask to quickly narrow down to the events we desire to capture
let keyEventMask =
  (1 << CGEventType.flagsChanged.rawValue)
  | (1 << CGEventType.keyDown.rawValue)
  | (1 << CGEventType.keyUp.rawValue)

let mouseEventMask =
  (1 << CGEventType.leftMouseDown.rawValue)
  | (1 << CGEventType.leftMouseUp.rawValue)
  | (1 << CGEventType.rightMouseDown.rawValue)
  | (1 << CGEventType.rightMouseUp.rawValue)
  | (1 << CGEventType.otherMouseDown.rawValue)
  | (1 << CGEventType.otherMouseUp.rawValue)

let eventMask =
  keyEventMask
  | mouseEventMask


//Create the event tap using [CGEvent.tapCreate](https://developer.apple.com/documentation/coregraphics/cgevent/1454426-tapcreate)
guard let eventTap = CGEvent.tapCreate(
        tap: .cgSessionEventTap,
        place: .headInsertEventTap,
        options: .defaultTap,
        eventsOfInterest: CGEventMask(eventMask),
        callback: myCGEventTapCallback,
        userInfo: nil
      ) else {
    logErr("Failed to create event tap. This may be because the application this is embedded within hasn't received permission. Please go to System Preferences > Security > Accesibility to add this application to the trusted applications.")
    exit(1)
}


//Launch threads for timeout system
let inputThread = DispatchQueue(label: "Input thread")
inputThread.async {
  checkInputLoop()
}
let timeoutThread = DispatchQueue(label: "Timeout thread")
timeoutThread.async {
  timeoutLoop()
}

//Enable tab and run event loop.
let runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, eventTap, 0)
CFRunLoopAddSource(CFRunLoopGetCurrent(), runLoopSource, .commonModes)
CGEvent.tapEnable(tap: eventTap, enable: true)
CFRunLoopRun() //Note: This is a blocking call
