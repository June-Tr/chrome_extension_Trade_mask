let SHIFT = "16";
let TAB = "9";
let F1 = "112";

let SHORTCUT = {
    ADD_TEXT : "q",
    BUTTON_CLICK: "a",
    ADD_LONG_PLANNER: "\`",
    ADD_SHORT_PLANNER: "1",
    ELLIOT_5_IMPULSE: "2",
    ELLIOT_3_CORRECTIVE: "3",
    ADD_3_TRIANLGE: "4",
    ADD_RECTANGLE: "5",
    NAV_HISTORY: "h",
    REMOVE_TARGET: "d",
    OPEN_ORDER_ADJUSTMENT: "z",
    OPEN_ALERT_MENU: "F1",

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