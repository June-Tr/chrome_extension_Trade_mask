
let NavTo = (name) => {
    //Check if all special tag object is loaded.
    
    if(cache.workspace[name] == undefined){
        TimeOutWrapper(
            () => {return !IsLoad(CONFIG.Html.WSPACE_H)},
            () => { 
                let container = Get(CONFIG.Html.WSPACE_H, -1);
                
                for(let i = 0; i < container.length; i++){
                    if(container[i].innerText == name){
                        cache.workspace[name] =container[i];
                        return container[i].click();
                       
                    }
                }
                console.log(`No work space name "${name}" !!!`);
            }
        )
    }else{
        cache.workspace[name].click();
    }
}
