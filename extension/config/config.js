
const CONFIG =  {
    RiskFactor: 46,
    MainWS: "EUR_USD",
    MENU: "group-2JyOhh7Z",
    MENU_INDEX : {
        ORDER: 20,
        TEXT:14,
        ELLIOT: 17
    },
    CONTAINER: "menuWrap-1gEtmoET",

    FEATURE: {
        INSERT_TXT:2,
        BUY: 2,
        SELL: 6,
        IMPULSE: 26,
        CORRECTIVE: 38,
        TRIANGLE: 14
    },
    Html :{
        ACCOUNT_SUMARY: "balance-dropdown",
        POSITION: "header-tab",
        POS_detail: "ag-row-even",
        HEADER: "left",
        BALANCE: "balance-bar__container",
        WSPACE_H:"workspace__item",
        WORKSPACES: [
            "EUR_USD",
            "History",
            "position"
        ],
    },
    Replacement: {
        ACCOUNT_SUMARY: "",
        BALANCE: ""
    },
    Addition: {
        Header:{
            RiskFactorTitle: `<div  class="rf_title" ">Risk per trade: </div>`,
            RiskFactor: "",
            LongPosLog:`<button id="bull" class="myButton but1"> Buy </button>`,
            ShortPosLog:`<button id="bear" class="myButton but2"> Sell </button>`
            
        }
    }
}
CONFIG.Addition.Header.RiskFactor = `<div class='RFactor'> \$${CONFIG.RiskFactor} </div>`;

/**
 * Cache: store most use feature,  and itself store, call event
 */
var cache = {
    header:{
        main: null,
        balance: null,
    },
    Main: {
        _cbOnMainReload: []
    },
    workspace:{ },
    Load: {
        _callbackOnPageLoad:[],
    },
    Position: {
        state: false,
        direction: "",
        price: "",
        entry: "",
        // use the listener pattern
        _callbackOnChange:[],
        reset: () => {
            cache.Position.state = false;
            cache.Position.direction = "";
            cache.Position.price = "";
            cache.Position.entry = "";

            cache.Position.Change();
        } 
    }
}
cache.Load.PageLoad = () => {
    cache.Load._callbackOnPageLoad.forEach((cb) => cb());
}
cache.Main.Reload = () => {
    cache.Main._cbOnMainReload.forEach((cb) => {
        cb();
    });
}
cache.Position.Change = async () => {
    cache.Position._callbackOnChange.forEach((cb) => cb());
}
cache.Position.test = () => {
    cache.Position.state = true;
    cache.Position.direction = "Sell";
    cache.Position.price = 1.09199;
    cache.Position.entry = "907119370";
    cache.Position.Change();
}