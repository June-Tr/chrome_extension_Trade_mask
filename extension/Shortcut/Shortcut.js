// Add keydown listener to listen for key press

let clickCount = 0;
let showGuide = false;
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


let canvasListener = async () => {
    
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
                        if(SHORTCUT.TOGGLE_GUIDE(event)){ 
                            popupStatic = !popupStatic;
                            showGuide = !showGuide;
                        }
                        
                        if(SHORTCUT.LOCK_TARGET(event)){
                            
                            findLockFeature(doc, "lock")
                        }
                        if(event.altKey && showGuide){
                            Get("shortcut",0, false, doc).style.display = "flex";
                        }
                        if(event.altKey){
                            switch(event.key){

                                case SHORTCUT.OPEN_ALERT_MENU:
                                    doc.querySelector("div[class='button-dealticket__label']").click();
                                    
                                    OpenAlertMenu();
                                    break;

                                case SHORTCUT.ADD_TEXT:
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.TEXT, CONFIG.FEATURE.INSERT_TXT);
                                    break;

                                case SHORTCUT.BUTTON_CLICK:
                                    cache.buttons.clickHandle();
                                    break;

                                case SHORTCUT.ADD_LONG_PLANNER:
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.ORDER, CONFIG.FEATURE.BUY);
                                    break;

                                case SHORTCUT.ADD_SHORT_PLANNER:
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.ORDER, CONFIG.FEATURE.SELL);
                                    break;

                                case SHORTCUT.ELLIOT_5_IMPULSE:
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.ELLIOT, CONFIG.FEATURE.IMPULSE);
                                    break;

                                case SHORTCUT.ELLIOT_3_CORRECTIVE:
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.ELLIOT, CONFIG.FEATURE.CORRECTIVE);
                                    break;

                                case SHORTCUT.ADD_3_TRIANLGE:
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.ELLIOT, CONFIG.FEATURE.TRIANGLE);
                                    break;

                                case SHORTCUT.ADD_RECTANGLE:
                                    clickCount ++;
                                    Open(doc, CONFIG.MENU_INDEX.SHAPE, CONFIG.FEATURE.RECTANGLE);
                                    break;

                                case SHORTCUT.NAV_HISTORY:
                                    NavTo("History");
                                    break;

                                case SHORTCUT.REMOVE_TARGET:
                                    findLockFeature(doc, "remove")
                                    break;

                                case SHORTCUT.OPEN_ORDER_ADJUSTMENT:
                                    openOrderAdjustment()
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

let openOrderAdjustment = async () => {
    TimeOutWrapper(
        () => {
            // check if the header tab loaded and reader to be scrap
            PotentialIssueAlert("OrderAdjustment")
            return !IsLoad("ag-pinned-left-cols-container")
        },
        () => {
            let positionPage = Get("ag-pinned-left-cols-container");
            positionPage = positionPage.querySelector("span[appdropdown]");
            positionPage.click();
            // navigate to the amend order button
            
            TimeOutWrapper(
                () => {
                    PotentialIssueAlert("OrderAdjustment:: Amend click");
                    return !IsLoad("dropdown__content", 1)
                },
                () => {
                    let target = (Get("dropdown__content", 1));
                    target = target.querySelector(".edit-position");
                    target.click();
                    positionPage.click();
                    // short cut to enter, exit
                    SubmitViaEnter_Exit();
                }

            )
        })
}

/**
 * Navigate to the alert menu.
 */
let OpenAlertMenu = () => {
    TimeOutWrapper(
        () => {
            // check if the header tab loaded and reader to be scrap
            PotentialIssueAlert("OpenAlertMenu")
            return document.getElementsByTagName("app-deal-ticket").length < 1
        },
        
        () => {
            let form = document.getElementsByTagName("app-deal-ticket")[0]
            let alertButton = form.querySelector("input[value='alert']");
            // focus so we can use the tab function
            form.addEventListener("click", () => {
                form.querySelectorAll("input")[3].focus();
            },true)
            form.addEventListener("keydown",
                (event) => {
                    if(event.key == "Tab"){
                        let container = form.querySelector("div[class='market-prices__direction']");
                        
                        for(let i = 0; i < container.children.length; i++){
                            let button = container.children[i]
                            if(!button.classList.contains("selected")){
                                
                                button.click();
                                form.click();
                                break;
                            }
                        }
                    }
                }, true
            )
            alertButton.click();
            
            TimeOutWrapper(
                () => {
                    PotentialIssueAlert("Focus alert input box")
                    return !form.querySelectorAll("label")[2].innerText.includes("SET ALERT")
                },
                () => {
                    form.querySelectorAll("input")[3].focus();
                }
            );
            const ENTER = "13";
            const ESC = "27";
            form.addEventListener("keydown",
                (event) => {
                    
                    if(event.keyCode == ENTER){
                        let butSubmit = form.querySelector("div[class='ticket-footer']");
                        
                        butSubmit = butSubmit.querySelector("button");
                        if(!butSubmit.classList.contains("disabled")){
                            TimeOutWrapper(
                                () => {
                                    PotentialIssueAlert("Close confirmation")
                                    return document.getElementsByTagName("app-ticket-confirmation-list").length < 1
                                },
                                () => {
                                    let form = document.getElementsByTagName("app-ticket-confirmation-list")[0]
                                    
                                    let button = form.querySelector("button")
                                    button.click();
                                }
                            )
                        }else{
                            alert("button is disabled")
                        }
                        butSubmit.click();

                        
                    } 
                    if(event.keyCode == ESC){
                        let butDestroy = form.querySelector("div[class='deal-ticket-header__destroy']");
                        butDestroy.click();
                    } 
                }, true);
            
        }
    )
}

/**
 * handle enter via an enter and close via a click > only viable if we use shortcut
 */
let SubmitViaEnter_Exit = async (clear = true) => {
    TimeOutWrapper(
        () => {
            // check if the header tab loaded and reader to be scrap
            PotentialIssueAlert("Enter_exit shortcut")
            return document.getElementsByTagName("app-deal-ticket").length < 1
        },
        
        () => {
            // Form will be the 3rd work space
            let form = document.getElementsByTagName("app-deal-ticket")[0]
            
            
           
            let fields = (form.querySelectorAll("span[_ngcontent-ng-c3494671082]"));
            if(clear) fields[5].innerHTML = '';
            //let blocks = form.querySelectorAll("div[_ngcontent-ng-c4118541851]");
            const ENTER = "13";
            const ESC = "27";
            
            form.querySelectorAll("input")[6].focus();
            form.addEventListener("click", () => {
                form.querySelectorAll("input")[6].focus();
            },true)
            form.addEventListener("keydown",
                (event) => {
                    
                    if(event.keyCode == ENTER){
                        let butSubmit = form.querySelector("div[class='ticket-footer']");
                        
                        butSubmit = butSubmit.querySelector("button");
                        if(!butSubmit.classList.contains("disabled")){
                            TimeOutWrapper(
                                () => {
                                    PotentialIssueAlert("Close confirmation")
                                    return document.getElementsByTagName("app-ticket-confirmation-list").length < 1
                                },
                                () => {
                                    let form = document.getElementsByTagName("app-ticket-confirmation-list")[0]
                                    
                                    let button = form.querySelector("button")
                                    button.click();
                                }
                            )
                        }else{
                            alert("button is disabled")
                        }
                        butSubmit.click();

                        
                    } 
                    if(event.keyCode == ESC){
                        let butDestroy = form.querySelector("div[class='deal-ticket-header__destroy']");
                        butDestroy.click();
                    } 
                }, true);
        }
    )

}

/**
 * @todo: need more adjust of solve
 */
let ToggleDirection = () => {
    TimeOutWrapper(
        () => {
            // check if the header tab loaded and reader to be scrap
            PotentialIssueAlert("ToggleDirection")
            return document.getElementsByTagName("app-deal-ticket").length < 1
        },
        
        () => {
            let form = document.getElementsByTagName("app-deal-ticket")[0]
            let button = form.querySelector("div[class='market-prices__direction']");
            //button.click();
        }
    )
}

let findLockFeature = async (doc, name  ) =>{
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
        alert(e)
    }
}

let Open = async (doc, menuIndex, feature) => {
    // open main menu
    //console.log(Get( CONFIG.MENU, 0, true, doc).getElementsByTagName("span"))
    Get( CONFIG.MENU, 0, true, doc).getElementsByTagName("span")[menuIndex].click();
    OpenFeature(doc, feature);
}

let OpenFeature = async (doc, feature) => {
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
