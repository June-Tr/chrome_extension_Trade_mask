/**
 * Navigation shortcut: WILL ONLY BE EXECUTED ONCE during page load event (main doc is loaded)
 */
let NavShortCut = async () => {
    document.addEventListener("keydown", 
        (event) => {
            if(event.altKey){
                switch(event.key){
                    case SHORTCUT.NAV_HISTORY:
                        NavTo("History");
                        break;
                    case SHORTCUT.NAV_MAIN_WS:
                        NavTo(CONFIG.MainWS);
                        break;
                    case SHORTCUT.BUTTON_CLICK:
                        cache.buttons.clickHandle();
                    default:
                        break;
                }
            }
        }
    , true)
}

/**
 * Control loop, that every single time workspace reload, add the listener to the target
 * 
 */
let canvasListener = async () => {
    TimeOutWrapper(
        () => {return document.getElementsByTagName("tpdwt-tvp-chart").length === 0},
        () => {
            // This is a sub document of the main HTML
            let ifrm = document.getElementsByTagName("tpdwt-tvp-chart")[0].children[0].children[0];
            let doc = ifrm.contentDocument? ifrm.contentDocument: ifrm.contentWindow.document;
            secondaryDocument = doc;
            // ensure doc is written during second load  
            if(!Get("group-2JyOhh7Z", 0, true, secondaryDocument)){
                SleepAndRerun(canvasListener, 500);
            }else {
                createPopup(doc)
                doc.addEventListener("keydown", 
                    (event) => {
                        
                        if(blockBySnipper && event.keyCode == SHORTCUT.CLOSE_FORM){
                            endSnip();
                        }
                        if(blockBySnipper){ 
                            return;
                        }
                        if(event.code  == "Space"){
                            if(event.ctrlKey){
                                spaceBarToggle = !spaceBarToggle;
                            }
                            if(spaceBarToggle)
                                openFromTargetMenu("settings")
                        }
                        if(!stopper && SHORTCUT.TOGGLE_GUIDE(event)){
                            popupStatic = !popupStatic;
                            showGuide = !showGuide;
                            if(showGuide){
                                secondaryDocument.addEventListener(
                                    "mousemoe", showShortCut, true
                                )
                            }else{
                                secondaryDocument.removeEventListener(
                                    "mousemoe", showShortCut, true
                                ) 
                            }
                            stopper = true;
                            SleepAndRerun(() => {stopper = false;});
                        }
                        if(lockTogglerEnable && SHORTCUT.LOCK_TARGET(event)){
                            
                            //openFromTargetMenu("lock")
                        }
                        if(event.altKey){
                            if(showGuide){
                                console.log("show")
                                Get("shortcut",0, false, doc).style.display = "flex";
                            }
                            switch(event.key){
                                case "F2":
                                    SnipCanvas();
                                    break;
                                case "F9":
                                    ExtractPastPosition(
                                        {year:2023, month:12, day:23}
                                    );
                                        break;
                                case SHORTCUT.OPEN_ALERT_MENU:
                                    //doc.querySelector("div[class='button-dealticket__label']").click();
                                    //OpenAlertMenu();
                                    getCurrentPointerPrice(event);
                                    break;

                                case SHORTCUT.ADD_TEXT:
                                    OpenDrawingToolMenu(CONFIG.MENU_INDEX.TEXT, CONFIG.FEATURE.INSERT_TXT);
                                    break;

                                case SHORTCUT.BUTTON_CLICK:
                                    cache.buttons.clickHandle();
                                    break;

                                case SHORTCUT.ADD_LONG_PLANNER:
                                    OpenDrawingToolMenu(CONFIG.MENU_INDEX.ORDER, CONFIG.FEATURE.BUY);
                                    break;

                                case SHORTCUT.ADD_SHORT_PLANNER:
                                    OpenDrawingToolMenu(CONFIG.MENU_INDEX.ORDER, CONFIG.FEATURE.SELL);
                                    break;

                                case SHORTCUT.ELLIOT_5_IMPULSE:
                                    OpenDrawingToolMenu(CONFIG.MENU_INDEX.ELLIOT, CONFIG.FEATURE.IMPULSE);
                                    break;

                                case SHORTCUT.ELLIOT_3_CORRECTIVE:
                                    OpenDrawingToolMenu(CONFIG.MENU_INDEX.ELLIOT, CONFIG.FEATURE.CORRECTIVE);
                                    break;

                                case SHORTCUT.ADD_3_TRIANLGE:
                                    OpenDrawingToolMenu(CONFIG.MENU_INDEX.ELLIOT, CONFIG.FEATURE.TRIANGLE);
                                    break;

                                case SHORTCUT.ADD_RECTANGLE:
                                    OpenDrawingToolMenu(CONFIG.MENU_INDEX.SHAPE, CONFIG.FEATURE.RECTANGLE);
                                    break;

                                case SHORTCUT.NAV_HISTORY:
                                    NavTo("History");
                                    break;

                                case SHORTCUT.REMOVE_TARGET:
                                    openFromTargetMenu("remove")
                                    break;

                                case SHORTCUT.OPEN_ORDER_ADJUSTMENT:
                                    lockTogglerEnable = false;
                                    openOrderAdjustment();
                                    ToggleCloseAdjust();
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
                doc.addEventListener("contextmenu", rightClickHandler, true)

            },{alertMessage:"canvasListener", tolerance: 200, killswitch: false}
    )
}
