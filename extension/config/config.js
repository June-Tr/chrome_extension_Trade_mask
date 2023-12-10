const CONFIG =  {
    RiskFactor: 46,
    Html :{
        ACCOUNT_SUMARY: "balance-dropdown",
        HEADER: "left",
        BALANCE: "balance-bar__container"
    },
    Replacement: {
        ACCOUNT_SUMARY: "",
        BALANCE: ""
    },
    Addition: {
        Header:{
            
            RiskFactorTitle: `<div> <div  class="rf_title" ">Risk per trade: </div> </div>`,
            RiskFactor: "",
            LongPosLog:`<div> <button id="bull" class="but1"> Long </button> </div>`,
            ShortPosLog:`<div> <button id="bear" class="but2"> Long </button> </div>`
            
        }
    }
}
CONFIG.Addition.RiskFactor = `<div style="font-size:21px!important;margin-left:10px;margin-right:10px;">\$${CONFIG.RiskFactor} </div>`;
//export default CONFIG;