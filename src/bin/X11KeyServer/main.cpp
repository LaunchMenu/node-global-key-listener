#include <iostream>
#include <X11/XKBlib.h>
#include <X11/extensions/XInput2.h>

int main() {
    Display * display = XOpenDisplay(nullptr);

    if (display == nullptr) {
        std::cerr << "Cannot open X display" << std::endl;
        exit(1);
    }

    int xiOpcode, queryEvent, queryError;
    if (!XQueryExtension(display, "XInputExtension", &xiOpcode, &queryEvent, &queryError)) {
        std::cerr << "X Input extension not available" << std::endl;
        exit(2);
    }

    int majorVersion = 2, minorVersion = 0;
    int queryResult = XIQueryVersion(display, &majorVersion, &minorVersion);
    if (queryResult == BadRequest) {
        std::cerr << "Expected X Input version 2.0" << std::endl;
        exit(3);
    } else if (queryResult != Success) {
        std::cerr << "Cannot query X Input version" << std::endl;
        exit(4);
    }

    Window rootWindow = DefaultRootWindow(display);
    XIEventMask eventMask;
    eventMask.deviceid = XIAllDevices;
    eventMask.mask_len = XIMaskLen(XI_LASTEVENT);

    eventMask.mask = (unsigned char *) calloc(eventMask.mask_len, sizeof(unsigned char));
    XISetMask(eventMask.mask, XI_RawKeyPress);
    XISetMask(eventMask.mask, XI_RawKeyRelease);
    XISetMask(eventMask.mask, XI_RawButtonPress);
    XISetMask(eventMask.mask, XI_RawButtonRelease);

    XISelectEvents(display, rootWindow, &eventMask, 1);
    XSync(display, false);
    free(eventMask.mask);

    int xkbOpcode, xkbEventCode;
    if (!XkbQueryExtension(display, &xkbOpcode, &xkbEventCode, &queryError, &majorVersion, &minorVersion)) {
        std::cerr << "X keyboard extension not available" << std::endl;
        exit(5);
    }

    long eventId = 0;

    int lastEvtype = 0;
    KeyCode lastKeyCode = 0;

    while (true) {
        XEvent xEvent;
        XGenericEventCookie *cookie = (XGenericEventCookie*)&xEvent.xcookie;
        XNextEvent(display, &xEvent);

        if (XGetEventData(display, cookie)) {
            if (
                cookie->type == GenericEvent
                && cookie->extension == xiOpcode
            ) {
                XIRawEvent *xInputRawEvent = (XIRawEvent *) cookie->data;

                bool isKeyboard =
                  cookie->evtype == XI_RawKeyRelease
                  || cookie->evtype == XI_RawKeyPress;

                bool isMouse =
                  cookie->evtype == XI_RawButtonRelease
                  || cookie->evtype == XI_RawButtonPress;

                KeyCode keyCode = xInputRawEvent->detail;
                int x = 0;
                int y = 0;

                if (isMouse) {
                  Window root, child;
                  int windowX, windowY;
                  unsigned int mask;

                  XQueryPointer(display, rootWindow, &root, &child, &x, &y, &windowX, &windowY, &mask);
                }

                bool isDown =
                  cookie->evtype == XI_RawKeyPress
                  || cookie->evtype == XI_RawButtonPress;

                bool isDuplicate = lastEvtype == cookie->evtype
                  && lastKeyCode == keyCode;

                if ((isKeyboard || isMouse) && !isDuplicate) {
                    std::cout
                      << (isKeyboard ? "KEYBOARD" : "MOUSE")
                      << ","
                      << (isDown ? "DOWN" : "UP")
                      << ","
                      << (long) keyCode
                      << ","
                      << x
                      << ","
                      << y
                      << ","
                      << eventId++
                      << std::endl;

                    std::flush(std::cout);
                }

                lastEvtype = cookie->evtype;
                lastKeyCode = keyCode;
            }
            XFreeEventData(display, cookie);
        }
    }
}
