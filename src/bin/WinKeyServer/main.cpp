#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <thread>
#include <string>
#include <cstddef>
#include <ctime>
#include <windows.h>

//How long to wait before timing out a key response
int timeoutTime = 30;

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
DWORD WINAPI timeoutLoop(LPVOID lpParam);
DWORD WINAPI checkInputLoop(LPVOID lpParam);

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

    //Create threads to deal with input
    HANDLE timeoutThread = CreateThread(NULL, 0, timeoutLoop, NULL, 0, NULL);
    HANDLE inputThread = CreateThread(NULL, 0, checkInputLoop, NULL, 0, NULL);

    //Hook to global keyboard events
    hKeyboardHook = SetWindowsHookEx(WH_KEYBOARD_LL, (HOOKPROC)KeyboardEvent, hInstance, 0);

    //Wait app is closed
    MessageLoop();

    //Unhook from global keyboard events
    UnhookWindowsHookEx(hKeyboardHook);

    //Dispose the threads
    CloseHandle(timeoutThread);
    CloseHandle(inputThread);

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
long curId = 0;
std::string output = "";

bool haltPropogation(KBDLLHOOKSTRUCT key, KeyState keyState)
{
    printErr(("Request: " + std::to_string(curId) + " " + std::to_string(key.vkCode)).c_str());
    printf("%i,%s,%i\n", key.vkCode, (keyState == down ? "DOWN" : "UP"), key.scanCode);
    fflush(stdout);

    requestTime = time(0) * 1000 + timeoutTime;
    ReleaseSemaphore(requestTimeoutSemaphore, 1, NULL);

    WaitForSingleObject(responseSemaphore, INFINITE);

    return output == "1";
}

DWORD WINAPI checkInputLoop(LPVOID lpParam)
{
    long receivedId = 0;
    while (true)
    {
        std::string entry;
        std::getline(std::cin, entry);

        WaitForSingleObject(signalMutex, INFINITE);
        if (receivedId == curId)
        {
            output = entry;
            curId = curId + 1;
            ReleaseSemaphore(responseSemaphore, 1, NULL);
            printErr(("Input: " + std::to_string(receivedId)).c_str());
        }
        ReleaseMutex(signalMutex);

        receivedId = receivedId + 1;
    }
    return 0;
}

DWORD WINAPI timeoutLoop(LPVOID lpParam)
{
    long receivedId = 0;
    while (true)
    {
        WaitForSingleObject(requestTimeoutSemaphore, INFINITE);
        long sleepDuration = requestTime - time(0) * 1000;

        if (sleepDuration > 0)
            Sleep(sleepDuration);

        WaitForSingleObject(signalMutex, INFINITE);
        if (receivedId == curId)
        {
            output = "0";
            curId = curId + 1;
            ReleaseSemaphore(responseSemaphore, 1, NULL);
            printErr(("Timeout: " + std::to_string(receivedId)).c_str());
        }
        ReleaseMutex(signalMutex);

        receivedId = receivedId + 1;
    }
    return 0;
}