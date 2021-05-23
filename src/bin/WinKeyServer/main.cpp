#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <string>
#include <cstddef>

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
bool haltPropogation(KBDLLHOOKSTRUCT key, KeyState keyState);
KeyState getKeyState(WPARAM wParam);
void printErr(const char *str);
std::string awaitLine();
std::string getString();
void fakeKey(DWORD iKeyEventF, WORD vkVirtualKey);

struct data
{
    char *buffer;
    std::size_t size;
};

HHOOK hKeyboardHook;
bool bIsMetaDown = false;
bool bIsAltDown;

/**
 * Definitions
 */
int main(int argc, char **argv)
{
    //Get module instance handle
    HINSTANCE hInstance = GetModuleHandle(NULL);
    if (!hInstance)
        return 1;

    //Hook to global keyboard events
    hKeyboardHook = SetWindowsHookEx(WH_KEYBOARD_LL, (HOOKPROC)KeyboardEvent, hInstance, 0);

    //Wait app is closed
    MessageLoop();

    //Unhook from global keyboard events
    UnhookWindowsHookEx(hKeyboardHook);

    return 0;
}

__declspec(dllexport) LRESULT CALLBACK KeyboardEvent(int nCode, WPARAM wParam, LPARAM lParam)
{
    //If key is up or down
    KeyState ks = getKeyState(wParam);
    if ((nCode == HC_ACTION) && ks)
    {
        KBDLLHOOKSTRUCT key = *((KBDLLHOOKSTRUCT *)lParam);

        //Work around for Windows key behaviour. See github issue #3
        if (key.vkCode == VK_LWIN || key.vkCode == VK_RWIN)
            bIsMetaDown = ks == down;
        if (key.vkCode == VK_LMENU || key.vkCode == VK_RMENU)
            bIsAltDown = ks == down;

        //Stop propogation if needed using stdio messaging. 1st param is casted lPARAM.
        //Returning 1 from this function will halt propogation
        if (haltPropogation(key, ks))
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
    }
    return CallNextHookEx(hKeyboardHook, nCode, wParam, lParam);
}

void MessageLoop()
{
    MSG message;
    while (GetMessage(&message, NULL, 0, 0))
    {
        TranslateMessage(&message);
        DispatchMessage(&message);
    }
}

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
    default:
        return none;
    }
}

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

bool haltPropogation(KBDLLHOOKSTRUCT key, KeyState keyState)
{
    //Print to out
    printf("%i,%s,%i\n", key.vkCode, (keyState == down ? "DOWN" : "UP"), key.scanCode);
    fflush(stdout);

    std::string line = awaitLine();
    return line == "1";
}

void printErr(const char str[])
{
    fprintf(stderr, str);
    fflush(stderr);
}

DWORD WINAPI get_input(LPVOID arg)
{
    data *buf = (data *)arg;
    return !std::cin.getline(buf->buffer, buf->size);
}

std::string awaitLine()
{
    char buffer[10] = {0};
    data arg = {buffer, 10};

    //Execute get_input callback in a new thread
    //TODO: Look into more performant way of timing out
    HANDLE h = CreateThread(NULL, 0, get_input, &arg, 0, 0);

    //Default buffer
    buffer[0] = '0';

    //Override buffer using thread
    if (h != NULL && WaitForSingleObjectEx(h, 100, FALSE) == WAIT_TIMEOUT)
    {
        printErr("Host application didn't respond in 100ms, timeout occurred, event propogated (not captured).");
    }

    //Close thread and return
    CloseHandle(h);
    return buffer;
}