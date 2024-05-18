#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <thread>
#include <string>
#include <cstddef>
#include <ctime>
#include <climits>

/*
Description:
  This C++ module uses `SetWindowsHookEx` to create a system-wide Low Level keyboard hook to intercept keyboard
  events before they reach other applications on the operating system. Event handling is offloaded to the
  calling process. The calling process is to decide whether the events should be caught or propogated.

  The key information sent to the main process is like:
    4,DOWN,0,1
    4,UP,0,2
    14,DOWN,0,3
    14,UP,0,4
    37,DOWN,0,5
    37,UP,0,6
    37,DOWN,0,7
    37,UP,0,8
    31,DOWN,0,9
    31,UP,0,10
  
  Note: the format of the information is as follows:
    VirtualKeyCode,UpDownState,ScanCode,EventID
  p.s. ScanCode has been removed (is 0) from the above for documentation purposes only.

  when `hello` is typed. If `H` is held down for a long period of time, DOWN events are repeated until released.
    4,DOWN,35,1
    4,DOWN,35,2
    4,DOWN,35,3
    4,DOWN,35,4
    4,DOWN,35,5
    4,DOWN,35,6
    4,UP,35,7
  
  The calling process should send "1,{id}\n" if it wants the tap to block the keypress and "0,{id}\n"
  if it wants the tap to propogate the keypress to the rest of the system (where {id} is the integer id received).

Notes:

  * Capturing keypresses while the windows key is down behaves differently to what you may expect. By default releasing the windows
  key opens the start menu in windows, unless another key is pressed or released before the windows key is released. When a process
  captures a key-down event while the windows key is down this message will not be sent to the OS, and thus will open the start menu.
  In order to prevent the start menu from opening up, we send an artifical VK_HELP key up event, whenever capturing a key while the
  windows key is pressed down. This also applies to the alt key. When this occurs a message "Sending VK_HELP to prevent win_key_up
  triggering start menu" is also send to stderr.
  * The hook procedure should process a message in less time than the data entry specified in the `LowLevelHooksTimeout` value in the 
  registry key `HKEY_CURRENT_USER\Control Panel\Desktop`. Note this is sometimes undefined and thus the timeout is an undocumented
  amount of time. If the hook procedure times out, the hook is silently removed without being called and there is no way for the 
  application to know whether the hook is removed or not. In order to accommodate for this timeout, our process requires all
  keystrokes to respond within 30ms of dispatch. If your process does not respond within 30ms the event will be propogated to the
  rest of the system.
  * The specific timeout time is declared in the `timeoutTime` global variable.

Compilation:

  1. Install mingw via VSCode plugin documentation [here](https://code.visualstudio.com/docs/languages/cpp#_example-install-mingwx64).
  2. Run the following command to build C++ application

    `"C:\MinGW\bin\c++.exe" "src\bin\WinKeyServer\main.cpp" -o "bin\WinKeyServer.exe" -static-libgcc -static-libstdc++`

*/

//How long to wait before timing out a key response
int timeoutTime = 30;

POINT zeroPoint { 0, 0 };

/**
 * HEADERS
 */
enum KeyState
{
    none = 0,
    down = 1,
    up = 2
};
void MessageLoop();
__declspec(dllexport) LRESULT CALLBACK KeyboardEvent(int nCode, WPARAM wParam, LPARAM lParam);
__declspec(dllexport) LRESULT CALLBACK MouseEvent(int nCode, WPARAM wParam, LPARAM lParam);
bool haltPropogation(bool isMouse, bool isDown, DWORD vkCode, DWORD scanCode, POINT location);
KeyState getKeyState(WPARAM wParam);
DWORD getMouseButtonCode(WPARAM wParam);
void printErr(const char *str);
std::string awaitLine();
std::string getString();
void fakeKey(DWORD iKeyEventF, WORD vkVirtualKey);
DWORD WINAPI timeoutLoop(LPVOID lpParam);
DWORD WINAPI checkInputLoop(LPVOID lpParam);

struct data
{
    char *buffer;
    std::size_t size;
};

HHOOK hKeyboardHook;
HHOOK hMouseHook;
bool bIsMetaDown = false;
bool bIsAltDown;

/**
 * Main process entry point
 * * Create threads used for timeout
 * * Register lowlevel keyboard hook
 * * Begin message loop
 */
int main(int argc, char **argv)
{
    //Get module instance handle
    HINSTANCE hInstance = GetModuleHandle(NULL);
    if (!hInstance)
        return 1;

    //Create threads to deal with input
    HANDLE timeoutThread = CreateThread(NULL, 0, timeoutLoop, NULL, 0, NULL);
    HANDLE inputThread = CreateThread(NULL, 0, checkInputLoop, NULL, 0, NULL);

    //Hook to global keyboard events
    hKeyboardHook = SetWindowsHookEx(WH_KEYBOARD_LL, (HOOKPROC)KeyboardEvent, hInstance, 0);
    hMouseHook = SetWindowsHookEx(WH_MOUSE_LL, (HOOKPROC)MouseEvent, hInstance, 0);

    //Wait app is closed
    MessageLoop();

    //Unhook from global keyboard events
    UnhookWindowsHookEx(hKeyboardHook);
    UnhookWindowsHookEx(hMouseHook);

    //Dispose the threads
    CloseHandle(timeoutThread);
    CloseHandle(inputThread);

    return 0;
}

/**
 * Callback which receives and captures low level keyboard events.
 * This callback should return non-zero result if the event is captured, otherwise return
 * result of CallNextHookEx
 */
__declspec(dllexport) LRESULT CALLBACK KeyboardEvent(int nCode, WPARAM wParam, LPARAM lParam)
{
    //If key is up or down
    KeyState ks = getKeyState(wParam);
    if ((nCode == HC_ACTION) && ks)
    {
        KBDLLHOOKSTRUCT key = *((KBDLLHOOKSTRUCT *)lParam);

        //Stop propogation if needed using stdio messaging. 1st param is casted lPARAM.
        //Returning 1 from this function will halt propogation
        if (haltPropogation(false, ks == down, key.vkCode, key.scanCode, zeroPoint))
        {
            //fixes issue https://github.com/LaunchMenu/node-global-key-listener/issues/3
            //TODO: maybe there is a better fix for this which doesn't involve sending arbitrary key events?
            if (bIsMetaDown || bIsAltDown)
            {
                printErr("Sending VK_HELP to prevent win_key_up triggering start menu");
                fakeKey(KEYEVENTF_KEYUP, VK_HELP);
            }
            return 1;
        }
        else
        {
            //Work around for Windows key behaviour. See github issue #3
            if (key.vkCode == VK_LWIN || key.vkCode == VK_RWIN)
                bIsMetaDown = ks == down;
            if (key.vkCode == VK_LMENU || key.vkCode == VK_RMENU)
                bIsAltDown = ks == down;
        }
    }
    return CallNextHookEx(hKeyboardHook, nCode, wParam, lParam);
}

/**
 * Callback which receives and captures low level mouse events.
 * This callback should return non-zero result if the event is captured, otherwise return
 * result of CallNextHookEx
 */
__declspec(dllexport) LRESULT CALLBACK MouseEvent(int nCode, WPARAM wParam, LPARAM lParam)
{
    MOUSEHOOKSTRUCT * pMouseStruct = (MOUSEHOOKSTRUCT *)lParam;
    KeyState ks = getKeyState(wParam);
    DWORD vCode = getMouseButtonCode(wParam);

    if (nCode >= 0 && pMouseStruct != NULL && ks && vCode)
    {
        //Stop propogation if needed using stdio messaging. 1st param is casted lPARAM.
        //Returning 1 from this function will halt propogation
        if (haltPropogation(true, ks == down, vCode, vCode, pMouseStruct->pt))
        {
            return 1;
        }
    }

    return CallNextHookEx(hKeyboardHook, nCode, wParam, lParam);
}

/**
 * Application's core message loop to persist application
 */
void MessageLoop()
{
    MSG message;
    while (GetMessage(&message, NULL, 0, 0))
    {
        TranslateMessage(&message);
        DispatchMessage(&message);
    }
}

/**
 * Translates wparam to KeyState enum
 * @returns up if KEYUP or SYSKEYUP, down if KEYDOWN or SYSKEYDOWN else none
 */
KeyState getKeyState(WPARAM wParam)
{
    switch (wParam)
    {
    case WM_KEYDOWN:
        return down;
    case WM_KEYUP:
        return up;

    case WM_SYSKEYDOWN:
        return down;
    case WM_SYSKEYUP:
        return up;

    case WM_LBUTTONDOWN:
        return down;
    case WM_LBUTTONUP:
        return up;

    case WM_RBUTTONDOWN:
        return down;
    case WM_RBUTTONUP:
        return up;

    case WM_MBUTTONDOWN:
        return down;
    case WM_MBUTTONUP:
        return up;

    default:
        return none;
    }
}

/**
 * Translates wparam to VK_* key code
 * @returns VK_LBUTTON, VK_RBUTTON, VK_MBUTTON or 0
 */
DWORD getMouseButtonCode(WPARAM wParam)
{
    switch (wParam)
    {
    case WM_LBUTTONDOWN:
    case WM_LBUTTONUP:
        return VK_LBUTTON;

    case WM_RBUTTONDOWN:
    case WM_RBUTTONUP:
        return VK_RBUTTON;

    case WM_MBUTTONDOWN:
    case WM_MBUTTONUP:
        return VK_MBUTTON;

    default:
        return 0;
    }
}

/**
 * Used to send fake virtual key to system.
 * @param iKeyEventF - 0 for key down event, KEYEVENTF_KEYUP for key up events and KEYEVENTF_EXTENDEDKEY for unicode(?)
 * @param vkVirtualKey - Virtual key to send keypress for
 */
void fakeKey(DWORD iKeyEventF, WORD vkVirtualKey)
{
    INPUT inputFix;
    inputFix.type = INPUT_KEYBOARD;
    inputFix.ki.wVk = vkVirtualKey;
    inputFix.ki.wScan = 0;
    inputFix.ki.dwFlags = iKeyEventF;
    inputFix.ki.time = 0;
    inputFix.ki.dwExtraInfo = 0;
    SendInput(1, &inputFix, sizeof(inputFix));
}

/**
 * Log error message to stderr
 */
void printErr(const char str[])
{
    fprintf(stderr, str);
    fflush(stderr);
}

// Key propagation communication with timeout
HANDLE signalMutex = CreateMutex(NULL, FALSE, NULL);
HANDLE requestTimeoutSemaphore = CreateSemaphore(NULL, 0, INT_MAX, NULL);
HANDLE responseSemaphore = CreateSemaphore(NULL, 0, INT_MAX, NULL);
long requestTime = 0;
long responseId = 0;
long timeoutId = 0;
long curId = 0;
std::string output = "";

/**
 * haltPropogation
 * Communicates key information with the calling process to identify whether the key event should
 * be propogated to the rest of the OS.
 * @param key    - The key pressed.
 * @param isDown - down, if a keydown event occurred, up if a keyup event occurred, none otherwise.
 * @returns Whether the event should be propogated or not.
 * @remark Sends a comma delimited string of the form "keyCode,DOWN,scanCode,eventID"  or "keyCode,UP,scanCode,eventID".
 *  Expects "1\n" (halt propogation of event) or "0\n" (do not halt propogation of event)
 * @remark This function timeouts after  30ms and returns false in order to propogate the event to the rest of the OS.
 */
bool haltPropogation(bool isMouse, bool isDown, DWORD vkCode, DWORD scanCode, POINT location)
{
    curId = curId + 1;
    printf("%s,%s,%i,%i,%ld,%ld,%i\n", (isMouse ? "MOUSE" : "KEYBOARD"), (isDown ? "DOWN" : "UP"), vkCode, scanCode, location.x, location.y, curId);
    fflush(stdout);

    // Indicate when the next timeout should occur
    requestTime = time(0) * 1000 + timeoutTime;
    ReleaseSemaphore(requestTimeoutSemaphore, 1, NULL);

    // Wait for any response
    WaitForSingleObject(responseSemaphore, INFINITE);

    return output == "1";
}

/**
 *  Synchronously reads a line from the stdin and tries to report the result to the haltPropogation function (if it hasn't
 *  timed out already)
 */
DWORD WINAPI checkInputLoop(LPVOID lpParam)
{
    while (true)
    {
        // Retrieve input and extract the code
        std::string entry;
        std::getline(std::cin, entry);

        int index = entry.find_first_of(",");
        std::string code = entry.substr(0, index);
        int id = atoi((entry.substr(index + 1)).c_str());

        // Lock the signalling, making sure the timeout doesn't signal it's response yet
        WaitForSingleObject(signalMutex, INFINITE);
        if (timeoutId < id)
        {
            // Set the output and signal that there is a response
            responseId = id;
            output = code;
            ReleaseSemaphore(responseSemaphore, 1, NULL);
        }
        ReleaseMutex(signalMutex);
    }
    return 0;
}

/**
 * Synchronously waits until a timeout occurs and reports this to the haltPropogation function if it hasn't received a response
 * yet.
 */
DWORD WINAPI timeoutLoop(LPVOID lpParam)
{
    while (true)
    {
        // Wait for a timeout to be requested
        WaitForSingleObject(requestTimeoutSemaphore, INFINITE);

        // Calculate how long to sleep in order to wake up at the requested time and start sleeping
        long sleepDuration = requestTime - time(0) * 1000;
        if (sleepDuration > 0)
            Sleep(sleepDuration);

        // Lock the signalling, making sure the input signalling can't happen before we finished here
        WaitForSingleObject(signalMutex, INFINITE);
        timeoutId = timeoutId + 1;
        if (responseId < timeoutId)
        {
            // Set the output to 0 and signal that there is a response
            output = "0";
            ReleaseSemaphore(responseSemaphore, 1, NULL);
        }
        ReleaseMutex(signalMutex);
    }
    return 0;
}
