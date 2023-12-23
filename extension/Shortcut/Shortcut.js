// Add keydown listener to listen for key press
let secondaryDocument = null;
let clickCount = 0;
let showGuide = false;
let onPosition = false;
let spaceBarToggle = true;
let stopper = false;
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
                SleepAndRerun(canvasListener, 1000);
            }else {
                createPopup(doc)
                doc.addEventListener("keydown", 
                    (event) => {
                        if(event.code  == "Space"){
                            console.log("Space hit")
                            console.log(spaceBarToggle)
                            if(event.ctrlKey){
                                spaceBarToggle = !spaceBarToggle;
                            }
                            if(spaceBarToggle)
                                openFromTargetMenu("settings")
                        }
                        if(!stopper && SHORTCUT.TOGGLE_GUIDE(event)){
                            popupStatic = !popupStatic;
                            showGuide = !showGuide;
                            stopper = true;
                            SleepAndRerun(() => {stopper = false;});
                        }
                        
                        if(SHORTCUT.LOCK_TARGET(event)){
                            openFromTargetMenu("lock")
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
                doc.addEventListener("contextmenu", rightClickHandler, true)

                
            },{alertMessage:"canvasListener", tolerance: 200, killswitch: false}
    )
}

/**
 * This deal with rightclick to place an entry order
 */
let rightClickHandler = async () => {
    TimeOutWrapper(
        () => {
            return secondaryDocument.querySelector("span[class='context-menu-wrapper']") == null},
        () => {
            let menu = secondaryDocument.querySelector("span[class='context-menu-wrapper']")
            if(menu.querySelectorAll("span").length == 0) SleepAndRerun(rightClickHandler, 300);

            let tradeButton = (secondaryDocument.querySelectorAll("span[class='label-1If3beUH']")[2])

            if("Create Limit Order..." == (tradeButton.innerText)){
                tradeButton.addEventListener("click",() => {HidePaperPLPositionForm(false)}, true);
            }
        }
        , {alertMessage: false, tolerance: 30, killswitch: true}
    )
}
/**
 * Open the order, position panel to : close, adjust
 */
let openOrderAdjustment = async () => {
    TimeOutWrapper(
        () => { return !IsLoad("ag-pinned-left-cols-container")},
        () => {
            positionPage = Get("ag-pinned-left-cols-container").querySelector("span[appdropdown]");
            if(positionPage != null) 
                positionPage.click();
            else{
                alert("There are no Order/Position");
                return;
            }
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
                    HidePaperPLPositionForm();
                }

            )
        },{alertMessage:"openOrderAdjustment", tolerance: 200, killswitch: false})
}

/**
 * (1) Navigate to the alert menu.
 * (2) Focus the window
 * (3) Add Submittion on Enter, Close on ESC button press
 */
let OpenAlertMenu = () => {
    TimeOutWrapper(
        () => {return document.getElementsByTagName("app-deal-ticket").length < 1 }, 
        () => {
            let form = document.getElementsByTagName("app-deal-ticket")[0]
            // focus so we can use the tab function
            TimeOutWrapper(
                () => { return !form.querySelectorAll("label")[2].innerText.includes("SET ALERT")},
                () => {
                    form.querySelector("input[value='alert']").click(); 
                    // focus after the tab switch
                    TimeOutWrapper(
                        () => { return !form.querySelector("span")?.children[2].classList.contains("selected")},
                        () => {form.getElementsByTagName("input")[3].focus()}
                    )
                },{alertMessage:"OpenAlertMenu: Focus", tolerance: 200, killswitch: false}
            );

            form.addEventListener("keydown",
                (event) => {
                    
                    if(SHORTCUT.TOGGLE_DIRECTION(event)){
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
                     
                }, true);
                SubmitViaEnter_Exit(3);
        }
        ,{alertMessage:"OpenAlertMenu", tolerance: 200, killswitch: false})
}

/**
 * On the form that adjust position
 */
let HidePaperPLPositionForm = async (isPosition=true) => {
    TimeOutWrapper(
        () => {return document.getElementsByTagName("app-deal-ticket").length < 1},
        () => {

            let form = document.getElementsByTagName("app-deal-ticket")[0];
            let value = (form.querySelectorAll("span[_ngcontent-ng-c3494671082]"))[5]
            
            if(value) value.style.opacity = "0";
            // target, stoplost numerical number
            let textInput = form.querySelectorAll("input[type='text']");
            
            textInput[(isPosition )? CONFIG.Html.POSITION_TARGET: CONFIG.Html.ORDER_TARGET].style.opacity = "0";
            
            // we need to keep the value for SL to adjust the size
            if(isPosition){
                textInput[CONFIG.Html.POSITION_SL].style.opacity = "0";
            
            }
        },
        {alertMessage: "HidePaperPL", tolerance: 100, killswitch: true}
    )
}
/**
 * handle enter via an enter and close via a click > only viable if we use shortcut
 */
let SubmitViaEnter_Exit = async (entryInputIndex = 6) => {
    TimeOutWrapper(
        () => { return document.getElementsByTagName("app-deal-ticket").length < 1},
        () => {
            let form = document.getElementsByTagName("app-deal-ticket")[0]
            form.querySelectorAll("input")[entryInputIndex].focus();

            form.addEventListener("click", () => { form.querySelectorAll("input")[entryInputIndex].focus() },true)
            form.addEventListener("keydown",
                (event) => {
                    if(event.keyCode == SHORTCUT.SUBMIT_FORM){
                        let butSubmit = form.querySelector("div[class='ticket-footer']")
                                            .querySelector("button");
                        if(butSubmit.classList.contains("disabled")){
                            alert("button is disabled")
                        }else{
                            TimeOutWrapper(
                                () => {return document.getElementsByTagName("app-ticket-confirmation-list").length < 1 },
                                () => document.getElementsByTagName("app-ticket-confirmation-list")[0]
                                                .click(),
                                {alertMessage: "SubmitViaEnter_Exit: Close confirmation", tolerance: 100, killswitch: true}
                            )
                        }
                        butSubmit.click();
                    } 
                    if(event.keyCode == SHORTCUT.CLOSE_FORM){
                        form.querySelector("div[class='deal-ticket-header__destroy']")
                            .click();
                    } 
                }, true);
        }
        ,{alertMessage:"SubmitViaEnter_Exit", tolerance: 200, killswitch: false})
    

}

/**
 * Target menu are from the drawing object in the canvas, by click it we will see a menu pop up
 * @param {String: use devTool from platform to see tha viable name} name 
 */
let openFromTargetMenu = async (name) =>{
    let menu = Get("tv-floating-toolbar__widget", -1, true, secondaryDocument);
    console.log(name)
    if(menu.length > 0){
        for(let i = 0; i < menu.length; i++){
            let button = menu[i].getElementsByTagName("div")[0]
            console.log(button)
            if(button.getAttribute('data-name') == name){
                
                // make sure no Propagation else lead to double click (left same state)
                button.addEventListener("click", (event) => {  event.preventDefault() }, true)
                button.click();
                break;
            }
        }
    }      

}

/**
 * 
 * @param {*} menuIndex 
 * @param {*} toolName 
 */
let OpenDrawingToolMenu = async (menuIndex, toolName) => {
    clickCount ++;
    Get( CONFIG.MENU, 0, true, secondaryDocument).getElementsByTagName("span")[menuIndex].click();
    OpenDrawingTool(toolName);
}

/**
 * 
 * @param {*} doc 
 * @param {*} toolName 
 */
let OpenDrawingTool = async (toolName) => {
    TimeOutWrapper(
        () => {return (clickCount % 2 == 0) 
                || !IsLoad(CONFIG.CONTAINER, 0, true, secondaryDocument)},
        () => {
            if(clickCount % 2 != 0){ // odd count
                
                let menuObject = Get(CONFIG.CONTAINER, 0, true, secondaryDocument);
                // not load the item we want
                if(menuObject.getElementsByTagName("div").length < 3){
                    return SleepAndRerun(() => OpenDrawingTool(secondaryDocument, menu, toolName))
                }
                menuObject.getElementsByTagName("div")[toolName].click();
                clickCount = 0;
            }
        },{alertMessage:"OpenDrawingTool", tolerance: 200, killswitch: false}
    )
    
}
