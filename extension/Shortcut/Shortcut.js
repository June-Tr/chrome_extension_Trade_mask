// Add keydown listener to listen for key press

let clickCount = 0;
let showGuide = false;

let NavShortCut = () => {
    document.addEventListener("keydown", 
        (event) => {
            if(event.altKey && event.key ==="H" ){
                NavTo("History");
            }
            if(event.altKey && event.key ==="M" ){
                NavTo(CONFIG.MainWS);
            }
            if(event.altKey && event.key ==="q" ){
                cache.buttons.clickHandle();
            }
            if(event.altKey && event.key ==="a" ){
                cache.buttons.clickHandle();
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
            // This is a sub document of the main HTML
            let ifrm = document.getElementsByTagName("tpdwt-tvp-chart")[0].children[0].children[0];
            let doc = ifrm.contentDocument? ifrm.contentDocument: ifrm.contentWindow.document;

            // ensure doc is written during second load
            if(Get("group-2JyOhh7Z", 0, true, doc) == null){
                let id = setTimeout(() => { 
                    clearTimeout(id);
                    return canvasListener();
                }, 1000);
            }
            
            else {
                createPopup(doc)

                doc.addEventListener("keydown", 
                    (event) => {
                        if(event.ctrlKey && event.keyCode == "16"){ // shift
                            
                            popupStatic = !popupStatic;
                            showGuide = !showGuide;
                        }if(event.keyCode == 9){ // tab
                            findLockFeature(doc, "lock")
                        }if(showGuide && event.altKey){
                            Get("shortcut",0, false, doc).style.display = "flex"
                        }

                        if(event.altKey){
                            switch(event.key){
                                case "q":
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.TEXT, CONFIG.FEATURE.INSERT_TXT);
                                    break;
                                case "a":
                                    cache.buttons.clickHandle();
                                    break;
                                case  "\`":
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.ORDER, CONFIG.FEATURE.BUY);
                                    break;
                                case "1":
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.ORDER, CONFIG.FEATURE.SELL);
                                    break;
                                case "2":
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.ELLIOT, CONFIG.FEATURE.IMPULSE);
                                    break;
                                case "3":
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.ELLIOT, CONFIG.FEATURE.CORRECTIVE);
                                    break;
                                case "4":
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.ELLIOT, CONFIG.FEATURE.TRIANGLE);
                                    break;
                                case "5":
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.SHAPE, CONFIG.FEATURE.RECTANGLE);
                                    break;
                                case "h":
                                    NavTo("History");
                                    break;
                                case "d":
                                    findLockFeature(doc, "remove")
                                    break;
                                default: break;
                            }
                        }
                    }
                , true)
                }

                doc.addEventListener("keyup", 
                    (event) => {
                        if(showGuide && event.keyCode == 18){
                            
                            event.preventDefault();
                            Get("shortcut",0, false, doc).style.display = "none";
                        }
                    },
                    true
                )
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
            //console.log(menuObject.getElementsByTagName("div"))
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
