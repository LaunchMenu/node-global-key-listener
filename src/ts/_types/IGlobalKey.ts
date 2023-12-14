type IUndefined = "";
type IKeyNumber = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type IKeyLetter =
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F"
    | "G"
    | "H"
    | "I"
    | "J"
    | "K"
    | "L"
    | "M"
    | "N"
    | "O"
    | "P"
    | "Q"
    | "R"
    | "S"
    | "T"
    | "U"
    | "V"
    | "W"
    | "X"
    | "Y"
    | "Z";
type IKeyAlphaNumeric = IKeyNumber | IKeyLetter;

type IKeyArrows = "UP ARROW" | "DOWN ARROW" | "LEFT ARROW" | "RIGHT ARROW";

type IKeyNumpadNumbers =
    | "NUMPAD 0"
    | "NUMPAD 1"
    | "NUMPAD 2"
    | "NUMPAD 3"
    | "NUMPAD 4"
    | "NUMPAD 5"
    | "NUMPAD 6"
    | "NUMPAD 7"
    | "NUMPAD 8"
    | "NUMPAD 9";
type IKeyNumpadSpecials =
    | "NUMPAD EQUALS"
    | "NUMPAD DIVIDE"
    | "NUMPAD MULTIPLY"
    | "NUMPAD MINUS"
    | "NUMPAD PLUS"
    | "NUMPAD RETURN"
    | "NUMPAD DOT";
type IKeyNumpad = IKeyNumpadNumbers | IKeyNumpadSpecials;

type IKeyModifiers =
    | "LEFT META"
    | "RIGHT META"
    | "LEFT CTRL"
    | "RIGHT CTRL"
    | "LEFT ALT"
    | "RIGHT ALT"
    | "LEFT SHIFT"
    | "RIGHT SHIFT"
    | "CAPS LOCK"
    | "NUM LOCK"
    | "SCROLL LOCK"
    | "FN";

type IKeyFXX =
    | "F1"
    | "F2"
    | "F3"
    | "F4"
    | "F5"
    | "F6"
    | "F7"
    | "F8"
    | "F9"
    | "F10"
    | "F11"
    | "F12"
    | "F13"
    | "F14"
    | "F15"
    | "F16"
    | "F17"
    | "F18"
    | "F19"
    | "F20"
    | "F21"
    | "F22"
    | "F23"
    | "F24";
type IKeySym =
    | "EQUALS"
    | "MINUS"
    | "SQUARE BRACKET OPEN"
    | "SQUARE BRACKET CLOSE"
    | "SEMICOLON"
    | "QUOTE"
    | "BACKSLASH"
    | "COMMA"
    | "DOT"
    | "FORWARD SLASH";
type IKeyButtons =
    | "SPACE"
    | "BACKSPACE"
    | "RETURN"
    | "ESCAPE"
    | "BACKTICK"
    | "SECTION"
    | "DELETE"
    | "TAB";
type IKeySpecials = IKeyFXX | IKeySym | IKeyButtons;
type IKeyRareUse = "INS" | "NUMPAD CLEAR" | "PRINT SCREEN";

type IScrollKeys = "PAGE UP" | "PAGE DOWN" | "HOME" | "END";

type IKeyMouseButton =
    | "MOUSE LEFT"
    | "MOUSE RIGHT"
    | "MOUSE MIDDLE"
    | "MOUSE X1"
    | "MOUSE X2";

type IKeyNSEvents =  'DIM' | 'BRIGHTEN' | 'KEYBOARD DIM'| 'KEYBOARD BRIGHTEN'|'REWIND' | 'PLAY' | 'FORWARD' | 'SILENCE' | 'VOLUME DOWN'  | 'VOLUME UP' ;

export type IGlobalKey =
    | IUndefined
    | IKeyAlphaNumeric
    | IKeyArrows
    | IKeyModifiers
    | IKeyMouseButton
    | IKeySpecials
    | IKeyNumpad
    | IScrollKeys
    | IKeyRareUse
    | IKeyNSEvents;
