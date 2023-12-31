let SHIFT = "16";
let TAB = "9";
let F1 = "112";
const ENTER = "13";
const ESC = "27";
let SHORTCUT = {
    SUBMIT_FORM: ENTER,
    CLOSE_FORM: ESC,
    ADD_TEXT : "q",
    BUTTON_CLICK: "a",
    ADD_LONG_PLANNER: "\`",
    ADD_SHORT_PLANNER: "1",
    ELLIOT_5_IMPULSE: "5",
    ELLIOT_3_CORRECTIVE: "3",
    ADD_3_TRIANLGE: "2",
    ADD_RECTANGLE: "4",
    NAV_HISTORY: "n",
    NAV_MAIN_WS: "m",
    REMOVE_TARGET: "d",
    OPEN_ORDER_ADJUSTMENT: "z",
    OPEN_ALERT_MENU: "F1",

    //default CITY INDEX SHORTCUT
    ADD_FIB: "f",
    ADD_TREND_LINE: "t",
    NAV_TO_PAST_CHART: "g",
    ADD_VERTICAL_LINE: "v",
    ADD_HORIZONTAL_LINE: "h",

    //default TRADING VIEW SHORTCUT
    SAVE_CANVAS:"s",
    TOGGLE_DIRECTION: (event) => {
        return event.keyCode == TAB;
    },
    TOGGLE_GUIDE: (event) => {
        return event.ctrlKey && event.keyCode == SHIFT
    },
    LOCK_TARGET: (event) => {
        return event.keyCode == TAB;
    }
}

// make sure the button does not has duplicate key shortcut.
let map = new Map();
(() => {
    // map's ke ymust occur once
    
    for(shortcut of Object.entries(SHORTCUT)){
        if(map.get(shortcut[1])){
            alert(`Shortcut ALT + <${shortcut[1]}> is used for multiple functions \n
                    \t  FUNCTIONs: <${shortcut[0]}>, <${map.get(shortcut[1])}>`);
            continue;
        }
        map.set(shortcut[1], shortcut[0]);
    }
    
})()