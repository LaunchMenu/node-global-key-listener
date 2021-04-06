/*
Description:
  This swift module creates a `CGEventTap` using `CGEvent.tapCreate` and `CGEventTapCallback` to intercept
  events before they reach other applications on the operating system. Event handling is offloaded to the
  calling process. The calling process is to decide whether the events should be caught or propogated.

  The key information sent to the main process is like:
    4,DOWN
    4,UP
    14,DOWN
    14,UP
    37,DOWN
    37,UP
    37,DOWN
    37,UP
    31,DOWN
    31,UP
  when `hello` is typed. If `H` is held down for a long period of time, DOWN events are repeated until released.
    4,DOWN
    4,DOWN
    4,DOWN
    4,DOWN
    4,DOWN
    4,DOWN
    4,UP
  
  The calling process should send "1\n" if it wants the tap to block the keypress and "0\n"
  if it wants the tap to propogate the keypress to the rest of the system.

Implementation Examples:

  https://gitlab.com/casual-programmer/eventmonitor/-/blob/master/Sources/EventMonitor/EventMonitor.swift

Compilation:

  `swiftc main.swift -o detectKeys`
*/


//Specific imports
import func Swift.print
import func Swift.readLine
import func Darwin.C.setbuf
import func Darwin.C.fflush
import var Darwin.C.stdout
import var Darwin.C.NULL

//Import of CGEvent, CGEventTapProxy, CGEventType, CGEvent, ...
import Foundation

/**
 * haltPropogation
 * Communicates key information with the calling process to identify whether the key event should
 * be propogated to the rest of the OS.
 * @param key    - The key code pressed.
 * @param isDown - true, if a keydown event occurred, false otherwise.
 * @returns Whether the event should be propogated or not.
 * @remark Sends a comma delimited string of the form "keyCode,DOWN"  or "keyCode,UP".
 *  Expects "1\n" (halt propogation of event) or "0\n" (do not halt propogation of event)
 */
func haltPropogation(key: Int64, isDown: Bool) -> Bool {
    print("\(key),\(isDown ? "DOWN" : "UP")")
    fflush(stdout)
    guard let line: String = readLine(strippingNewline: true) else {return false}
    return line=="1"
}

/**
 * myCGEventTapCallback
 * [CGEventTapCallback](https://developer.apple.com/documentation/coregraphics/cgeventtapcallback) used by CGEvent.tapCreate
 * @remark returning nil from this callback destroys the event and stops it propogating to
 * other windows in the system, as required. If not captured the event should be returned and `passRetained`.
 * @remark keyCodes can be found [here](https://stackoverflow.com/a/16125341).
 */
func myCGEventTapCallback(proxy: CGEventTapProxy, type: CGEventType, event: CGEvent, refcon: UnsafeMutableRawPointer?) -> Unmanaged<CGEvent>? {
    if [.keyDown , .keyUp].contains(type) {
        let keyCode = event.getIntegerValueField(.keyboardEventKeycode) //CGKeyCode
        if(haltPropogation(key: keyCode, isDown: type == .keyDown)){
            return nil
        }
    }
    return Unmanaged.passRetained(event)
}

//Define an event mask to quickly narrow down to the events we desire to capture
let eventMask = (1 << CGEventType.keyDown.rawValue) | (1 << CGEventType.keyUp.rawValue)

//Create the event tap using [CGEvent.tapCreate](https://developer.apple.com/documentation/coregraphics/cgevent/1454426-tapcreate)
guard let eventTap = CGEvent.tapCreate(tap: .cgSessionEventTap,
                                      place: .headInsertEventTap,
                                      options: .defaultTap,
                                      eventsOfInterest: CGEventMask(eventMask),
                                      callback: myCGEventTapCallback,
                                      userInfo: nil) else {
                                        print("failed to create event tap")
                                        exit(1)
}

//Enable tab and run event loop.
let runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, eventTap, 0)
CFRunLoopAddSource(CFRunLoopGetCurrent(), runLoopSource, .commonModes)
CGEvent.tapEnable(tap: eventTap, enable: true)
CFRunLoopRun()