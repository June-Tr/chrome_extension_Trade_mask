import * as CONFIG from "config/CONFIG.js" ;

// cache for the handle so we dont need to find it every single time we need it
let cache = {
    header:{
        main: null,
        balance: null,
        longButton: null,
        shortButton: null,
    },
    workspace:{
        main: null,
        history: null,
        position: null
    },
    loaded: false
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
            return TimeOutWrapper(sleepCondition, cb, time);
        }, time);
    }else{
        cb();
    }
}

/**
 * Wrapper <- to improve readability. Default object will be whole document.
 * @param {class name/ id} name 
 * @param {in the array of class} index 
 * @param {if this is a class} isClass 
 * @returns 
 */
let Get = (name, index=0, isClass=true, from=document) => {
    return from.querySelectorAll(`${(isClass)?'.':'#'}${name}`)[index]; 
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


let ModifyHeader = async() => {
    TimeOutWrapper(
        () => { 
            
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
                    + CONFIG.Addition.Header.ShortPosLog
            
            cache.header.longButton = Get("bull", cache.header.main);
            cache.header.shortButton = Get("bear", cache.header.main);
        }
    )
}