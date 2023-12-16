// Add keydown listener to listen for key press

let clickCount = 0;

let NavShortCut = () => {
    document.addEventListener("keydown", 
        (event) => {
                    
            if(event.altKey && event.key ==="H" ){
                NavTo("History");
            }
            if(event.altKey && event.key ==="M" ){
                NavTo(CONFIG.MainWS);
            }
        }
    , true)
}

let canvasListener = () => {
    
    TimeOutWrapper(
        () => {
            PotentialIssueAlert("CanvasListener")
            return document.getElementsByTagName("tpdwt-tvp-chart").length === 0
        },
        () => {
            let ifrm = document.getElementsByTagName("tpdwt-tvp-chart")[0].children[0].children[0];
            let doc = ifrm.contentDocument? ifrm.contentDocument: ifrm.contentWindow.document;

            // ensure doc is written during second load
            if(Get("group-2JyOhh7Z", 0, true, doc) == null){
                let id = setTimeout(() => { 
                    clearTimeout(id);
                    return canvasListener();
                }, 1000);
            }
            else 
                doc.addEventListener("keydown", 
                    (event) => {
                        if(event.altKey && event.key === "\`" ){
                            clickCount ++;
                            Open(doc, CONFIG.MENU_INDEX.ORDER, CONFIG.FEATURE.BUY);
                        }
                        if(event.altKey && event.key ==="1" ){
                            clickCount ++;
                            Open(doc, CONFIG.MENU_INDEX.ORDER, CONFIG.FEATURE.SELL);
                        }
                        if(event.altKey && event.key ==="2" ){
                            clickCount ++;
                            Open(doc, CONFIG.MENU_INDEX.ELLIOT, CONFIG.FEATURE.IMPULSE);
                        }
                        if(event.altKey && event.key ==="3" ){
                            clickCount ++;
                            Open(doc, CONFIG.MENU_INDEX.ELLIOT, CONFIG.FEATURE.CORRECTIVE);
                        }
                        if(event.altKey && event.key ==="H" ){
                            NavTo("History");
                        }
                        if(event.keyCode == 9){
                            findLockFeature(doc, "lock")
                        }
                        if(event.altKey && event.key ==="x" ){
                            findLockFeature(doc, "lock")
                        }
                        
                    }
                , true)
                }
    )
}

let findLockFeature = (doc, name) =>{
    try{
        
        let menu = Get("tv-floating-toolbar__widget", -1, true, doc);

        if(menu.length == 0)
            return;

        let found = false;
        for(let i = 0; i < menu.length; i++){
            let child = menu[i]
            
            let button = child.getElementsByTagName("div")[0]
            if(button.getAttribute('data-name') == name){
                
                found = true;
                // make sure no Propagation else lead to double click (left same state)
                button.addEventListener("click", (event) => {
                    //event.stopImmediatePropagation();
                    event.preventDefault();
                }, true)
                button.click();
                //break;
            }
            
        }
        
    }catch (e) {
        
        console.log(e)
    }
}

let Open = (doc, menuIndex, feature) => {
    // open main menu
    //console.log(Get( CONFIG.MENU, 0, true, doc).getElementsByTagName("span"))
    Get( CONFIG.MENU, 0, true, doc).getElementsByTagName("span")[menuIndex].click();
    OpenFeature(doc, feature);
}

let OpenFeature = (doc, feature) => {
    TimeOutWrapper(
        () => {  
            PotentialIssueAlert("OpenFeature:")
            return (clickCount % 2 == 0) 
                || !IsLoad(CONFIG.CONTAINER, 0, true, doc);
        },
        () => {
            if(clickCount % 2 == 0) {
                return;
            }
            let menuObject = Get(CONFIG.CONTAINER, 0, true, doc);
            // not load the item we want
            if(menuObject.getElementsByTagName("div").length < 3){
                let id = setTimeout(() => { 
                    clearTimeout(id);
                    return OpenFeature(doc, menu, feature);
                }, 100);
            }
            menuObject.getElementsByTagName("div")[feature].click();
            clickCount = 0;
        }
    )
}
