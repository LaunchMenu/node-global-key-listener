#define _WIN32_WINNT 0x0400
#pragma comment( lib, "user32.lib" )

#include <iostream>
#include <windows.h>
#include <stdio.h>

HHOOK hKeyboardHook;


__declspec(dllexport) LRESULT CALLBACK KeyboardEvent(int nCode, WPARAM wParam, LPARAM lParam)
{
    if ((nCode == HC_ACTION) && ((wParam == WM_SYSKEYDOWN) || (wParam == WM_KEYDOWN) || (wParam == WM_KEYUP) || (wParam == WM_SYSKEYUP)))
    {
        KBDLLHOOKSTRUCT hooked_key = *((KBDLLHOOKSTRUCT*)lParam);
        
        //Track up/down
        bool upDownFlag;
        if((wParam == WM_SYSKEYDOWN) || (wParam == WM_KEYDOWN)){
            upDownFlag = true;
        } else if((wParam == WM_KEYUP) || (wParam == WM_SYSKEYUP)){
            upDownFlag = false;
        }

        //Get virtual key code
        int key = hooked_key.vkCode;

        printf("Keycode = %i,%s\n", key,upDownFlag ? "DOWN" : "UP");
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

DWORD WINAPI my_HotKey(LPVOID lpParm)
{
    HINSTANCE hInstance = GetModuleHandle(NULL);
    if (!hInstance) hInstance = LoadLibraryA((LPCSTR)lpParm);
    if (!hInstance) return 1;

    hKeyboardHook = SetWindowsHookEx(WH_KEYBOARD_LL, (HOOKPROC)KeyboardEvent, hInstance, 0);
    MessageLoop();
    UnhookWindowsHookEx(hKeyboardHook);
    return 0;
}


int main(int argc, char** argv)
{
    
    HANDLE hThread;
    DWORD dwThread;

    hThread = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)my_HotKey, (LPVOID)argv[0], 0, &dwThread);
    
    // uncomment to hide console window
    //ShowWindow(FindWindowA("ConsoleWindowClass", NULL), false);

    if (hThread) return WaitForSingleObject(hThread, INFINITE);
    else return 1;
    
   MessageBoxA(NULL, "Shutting down", "H O T K E Y", MB_OK);

}