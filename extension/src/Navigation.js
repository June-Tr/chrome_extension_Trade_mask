
let NavTo = (name, cb = () => {}) => {
    //Check if all special tag object is loaded.
    let FoundWs = false;
    if(cache.workspace[name] == undefined){
        TimeOutWrapper(
            () => {return !IsLoad(CONFIG.Html.WSPACE_H)},
            () => { 
                
                let container = Get(CONFIG.Html.WSPACE_H, -1);
                
                for(let i = 0; i < container.length; i++){
                    if(container[i].innerText == name){
                        cache.workspace[name] =container[i];
                        FoundWs = true;
                        container[i].click();  
                        cb();  
                        break;
                    }
                }
                if(!FoundWs)
                    console.log(`No work space name "${name}" !!!`);

                if(name == CONFIG.MainWS){
                    cache.workspace[name].addEventListener(
                        "click",
                        cache.Main.Reload
                    )
                    cache.Main.Reload();
                }
                
            }
        )
    }else{
        cache.workspace[name].click();
        cb();
        if(name == CONFIG.MainWS)
            cache.Main.Reload();
        
    }

    
    
}

