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
    eventMask.deviceid = XIAllMasterDevices;
    eventMask.mask_len = XIMaskLen(XI_LASTEVENT);
    eventMask.mask = (unsigned char *) calloc(eventMask.mask_len, sizeof(unsigned char));
    XISetMask(eventMask.mask, XI_RawKeyPress);
    XISetMask(eventMask.mask, XI_RawKeyRelease);
    XISelectEvents(display, rootWindow, &eventMask, 1);
    XSync(display, false);
    free(eventMask.mask);

    int xkbOpcode, xkbEventCode;
    if (!XkbQueryExtension(display, &xkbOpcode, &xkbEventCode, &queryError, &majorVersion, &minorVersion)) {
        std::cerr << "X keyboard extension not available" << std::endl;
        exit(5);
    }

    long eventId = 0;

    while (true) {
        XEvent event;
        XGenericEventCookie *cookie = (XGenericEventCookie*)&event.xcookie;
        XNextEvent(display, &event);

        if (XGetEventData(display, cookie)) {
            if (
                cookie->type == GenericEvent
                && cookie->extension == xiOpcode
                && (
                    cookie->evtype == XI_RawKeyRelease
                    || cookie->evtype == XI_RawKeyPress
                )
            ) {
                XIRawEvent *xInputEvent = (XIRawEvent *) cookie->data;
                KeyCode keyCode = xInputEvent->detail;

                std::cout
                    << (long) keyCode
                    << ","
                    << ((cookie->evtype == XI_RawKeyPress) ? "DOWN" : "UP")
                    << ","
                    << eventId++
                    << std::endl;
                std::flush(std::cout);
            }
            XFreeEventData(display, cookie);
        }
    }
}
