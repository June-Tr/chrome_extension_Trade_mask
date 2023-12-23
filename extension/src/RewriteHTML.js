//import * as CONFIG from "config/CONFIG.js" ;

// cache for the handle so we dont need to find it every single time we need it

let controlLoopCount = 0;
let PotentialIssueAlert = (callerName, loopCount = 200, terminatedOnIssue) => {
    if(controlLoopCount > loopCount){
        
        if(callerName) alert("There are a potential of infinite loop @:" + callerName);
        controlLoopCount = 0;

        return (terminatedOnIssue) ? true : false;
    }
}
/**
 * a wrapper around setTimeout
 * @param {() => Boolean} sleepCondition filter function that if return true: sleep for <time> amount
 * @param {() => void} cb success promise 
 * @param {Int} time that this task will be sleep for 
 * @param {alertMessage: Str, tolerance: Int, killswitch: Bool} config modify how the funciton react when potential failure occur: default terminate on failure
 * @returns 
 */
let TimeOutWrapper = async (sleepCondition, cb, config = {alertMessage: false, tolerance: 200, killswitch: true},  time=100) => {
    const {alertMessage, tolerance, killswitch} = config;

    if(sleepCondition()){ 
        if(PotentialIssueAlert(alertMessage, tolerance, killswitch))
            return;

        let id = setTimeout(() => { 
            clearTimeout(id);
            controlLoopCount++;
            return TimeOutWrapper(sleepCondition, cb, time, config);
        }, time);
    }else{
        controlLoopCount = 0;
        cb();
    }
}
/**
 * Like the Time out but this case, sleep once
 * @param {*} cb 
 * @param {*} time 
 */
let SleepAndRerun = async (cb, time = 100) => {
    let id = setTimeout(() => { 
        clearTimeout(id);
        cb();
    }, time);
}
/**
 * Wrapper <- to improve readability. Default object will be whole document.
 * @param {class name/ id} name 
 * @param {-1: get the whole array | >0 : index of the desired item} index 
 * @param {if this is a class} isClass 
 * @returns 
 */
let Get = (name, index=0, isClass=true, from=document) => {
    return (index > -1) 
        ? from.querySelectorAll(`${(isClass)?'.':'#'}${name}`)[index]
        : from.querySelectorAll(`${(isClass)?'.':'#'}${name}`); 
}

/**
 * We want to ensure the targeted tag is loaded (dynamically) in the visible dom
 * @param {class/id of the block} name 
 * @param {case class} InterestedObjIndex 
 * @param {which filter method} isClass 
 * @returns 
 */
let IsLoad = (name, InterestedObjIndex=0, isClass=true, from=document) => {
    return from.querySelectorAll(`${(isClass)?'.':'#'}${name}`).length > InterestedObjIndex;
}


/**
 * (1): Remove the balance
 * (2): Add the risk allowance
 * (3): add 2 clickable button for trade log.
 */
let ModifyHeader = async() => {
    TimeOutWrapper(
        () => { return !IsLoad(CONFIG.Html.ACCOUNT_SUMARY) || !IsLoad(CONFIG.Html.HEADER)},
        () => {
            cache.header.main = Get(CONFIG.Html.HEADER);
            cache.header.balance = Get(CONFIG.Html.BALANCE)

            Get(CONFIG.Html.ACCOUNT_SUMARY).innerHTML = CONFIG.Replacement.ACCOUNT_SUMARY;
            cache.header.balance.innerHTML = CONFIG.Replacement.BALANCE;
      
            cache.header.main.innerHTML 
                += CONFIG.Addition.Header.RiskFactorTitle
                    + CONFIG.Addition.Header.RiskFactor
                    + CONFIG.Addition.Header.LongPosLog
                    + CONFIG.Addition.Header.ShortPosLog;
            
            PrepareCache();
        },{alertMessage:"ModifyHeader", tolerance: 200, killswitch: false}
        , 20
    )
}

/**
 * This method is to check the added feature is present, hence potentially the page load is complete
 */
let PrepareCache = () =>{

    TimeOutWrapper(
        () => {
            PotentialIssueAlert("PrepareCache")
            return (!IsLoad("bull",0, false) 
                || !IsLoad("bear",0, false)
            )
        },
        () =>  cache.Load.PageLoad()
        ,{alertMessage:"ModifyHeader", tolerance: 200, killswitch: false}
    )
}

