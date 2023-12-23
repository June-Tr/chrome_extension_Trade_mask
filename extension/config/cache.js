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

let cooldown = false;
cache.Main.Reload = () => {
    if(!cooldown){
        cooldown = true;
        cache.Main._cbOnMainReload.forEach((cb) => {
            console.log(cb);
            cb();
        });

        let id = setTimeout(() => { 
            clearTimeout(id);
            cooldown = false;
        }, 500);
    }
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