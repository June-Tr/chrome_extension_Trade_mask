//import * as CONFIG from "config/CONFIG.js" ;

// cache for the handle so we dont need to find it every single time we need it

let controlLoopCount = 0;
let PotentialIssueAlert = (callerName, loopCount = 200) => {
    if(controlLoopCount > loopCount){
        
        alert("There are a potential of infinite loop @:" + callerName);
        controlLoopCount = 0;
    }
}
/**
 * 
 * @param {() => Boolean} sleepCondition filter function
 * @param {() => void} cb success promise 
 * @param {Int} time that this task will be sleep for 
 */
let TimeOutWrapper = async (sleepCondition, cb, time=100) => {

    
    if(sleepCondition()){
        let id = setTimeout(() => { 
            clearTimeout(id);
            controlLoopCount++;
            return TimeOutWrapper(sleepCondition, cb, time);
        }, time);
    }else{
        controlLoopCount = 0;
        cb();
    }
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
        () => { 
            PotentialIssueAlert("ModifyHeader",1000);
            return !IsLoad(CONFIG.Html.ACCOUNT_SUMARY) || !IsLoad(CONFIG.Html.HEADER);
        },
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
        },
        20
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
        () => {
            cache.Load.PageLoad();
        }
    )
}
