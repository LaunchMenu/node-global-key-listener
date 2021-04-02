//https://gitlab.com/casual-programmer/eventmonitor/-/blob/master/Sources/EventMonitor/EventMonitor.swift

import Foundation

func haltPropogation(data: int){
    print(data)
    return Bool(readLine(strippingNewline: true)!)!
}

func myCGEventCallback(proxy: CGEventTapProxy, type: CGEventType, event: CGEvent, refcon: UnsafeMutableRawPointer?) -> Unmanaged<CGEvent>? {
    if [.keyDown , .keyUp].contains(type) {
        var keyCode = event.getIntegerValueField(.keyboardEventKeycode)
        
        if(!haltPropogation(1)){
            return Unmanaged.passUnretained(event)
        }
    }
    return Unmanaged.passRetained(event)
}

let eventMask = (1 << CGEventType.keyDown.rawValue) | (1 << CGEventType.keyUp.rawValue)
guard let eventTap = CGEvent.tapCreate(tap: .cgSessionEventTap,
                                      place: .headInsertEventTap,
                                      options: .defaultTap,
                                      eventsOfInterest: CGEventMask(eventMask),
                                      callback: myCGEventCallback,
                                      userInfo: nil) else {
                                        print("failed to create event tap")
                                        exit(1)
}

let runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, eventTap, 0)
CFRunLoopAddSource(CFRunLoopGetCurrent(), runLoopSource, .commonModes)
CGEvent.tapEnable(tap: eventTap, enable: true)
CFRunLoopRun()
