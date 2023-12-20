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

