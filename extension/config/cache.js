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
        mostRecent: {entry:null, exit:null},
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

let cooldown = false;
cache.Main.Reload = () => {
    if(!cooldown){
        cooldown = true;
        cache.Main._cbOnMainReload.forEach((cb) => {cb()});
        SleepAndRerun(()=>cooldown = false, 500)
    }
}
cache.Position.Change = async () => {
    cache.Position._callbackOnChange.forEach((cb) => cb());
}
cache.Position.test = () => {
    cache.Position.state = true;
    cache.Position.direction = "Buy";
    cache.Position.price = 1.10315;
    cache.Position.entry = "908030808";
    cache.Position.Change();
}