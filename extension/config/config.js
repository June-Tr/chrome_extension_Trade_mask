const CONFIG =  {
    RiskFactor: 46,
    Html :{
        ACCOUNT_SUMARY: "balance-dropdown",
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
            LongPosLog:`<button id="bull" class="myButton but1"> Long </button>`,
            ShortPosLog:`<button id="bear" class="myButton but2"> Short </button>`
            
        }
    }
}

CONFIG.Addition.Header.RiskFactor = `<div class='RFactor'> \$${CONFIG.RiskFactor} </div>`;
