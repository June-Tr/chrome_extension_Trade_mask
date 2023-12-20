
const CONFIG =  {
    RiskFactor: 46,
    MainWS: "EUR_USD",
    MENU: "group-2JyOhh7Z",
    MENU_INDEX : {
        ORDER: 20,
        TEXT:14,
        ELLIOT: 17,
        SHAPE: 11
    },
    CONTAINER: "menuWrap-1gEtmoET",
    FEATURE: {
        INSERT_TXT:2,
        BUY: 2,
        SELL: 6,
        IMPULSE: 26,
        CORRECTIVE: 38,
        TRIANGLE: 14,
        RECTANGLE: 6,
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
