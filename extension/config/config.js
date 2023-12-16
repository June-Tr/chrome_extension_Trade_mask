const CONFIG =  {
    RiskFactor: 46,
    MainWS: "EUR_USD",
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

var cache = {
    header:{
        main: null,
        balance: null,
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
cache.Position.Change = async () => {
    cache.Position._callbackOnChange.forEach((cb) => cb());
}

cache.Position.test = () => {
    console.log("test running")
    cache.Position.state = true;
    cache.Position.direction = "Sell";
    cache.Position.price = 1.09199;
    cache.Position.entry = "907119370";
    cache.Position.Change();
}