#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <string>

/**
 * HEADERS
 */
enum KeyState {
    none = 0,
    down = 1,
    up = 2
};
void MessageLoop();
__declspec(dllexport) LRESULT CALLBACK KeyboardEvent(int nCode, WPARAM wParam, LPARAM lParam);
bool haltPropogation(KBDLLHOOKSTRUCT key, KeyState keyState);
KeyState getKeyState(WPARAM wParam);


HHOOK hKeyboardHook;


/**
 * Definitions
 */
int main(int argc, char** argv) {
    //Get module instance handle
    HINSTANCE hInstance = GetModuleHandle(NULL);
    if (!hInstance) return 1;

    //Hook to global keyboard events
    hKeyboardHook = SetWindowsHookEx(WH_KEYBOARD_LL, (HOOKPROC)KeyboardEvent, hInstance, 0);

    //Wait app is closed
    MessageLoop();

    //Unhook from global keyboard events
    UnhookWindowsHookEx(hKeyboardHook);
    return 0;
}

__declspec(dllexport) LRESULT CALLBACK KeyboardEvent(int nCode, WPARAM wParam, LPARAM lParam) {
    //If key is up or down
    KeyState ks = getKeyState(wParam);
    if ((nCode == HC_ACTION) && ks) {
        //Stop propogation if needed using stdio messaging. 1st param is casted lPARAM.
        //Returning 1 from this function will halt propogation
        if(haltPropogation(*((KBDLLHOOKSTRUCT*)lParam), ks)) return 1;
    }   
    return CallNextHookEx(hKeyboardHook, nCode, wParam, lParam);
}

void MessageLoop() {
    MSG message;
    while (GetMessage(&message, NULL, 0, 0))
    {
        TranslateMessage(&message);
        DispatchMessage(&message);
    }
}

KeyState getKeyState(WPARAM wParam){
    switch(wParam){
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

using namespace std;
bool haltPropogation(KBDLLHOOKSTRUCT key, KeyState keyState){
   //Print to out
   printf("%i,%s,%i\n",key.vkCode, (keyState == down ? "DOWN" : "UP"), key.scanCode);
   fflush(stdout);

   string line;
   getline(cin, line);
   return line == "1";
}