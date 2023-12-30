// Add keydown listener to listen for key press
let secondaryDocument = null;
let clickCount = 0;
let showGuide = false;
let onPosition = false;
let spaceBarToggle = true;
let stopper = false;
let lockTogglerEnable = true;

let first = true;
let price = 0;
let getPrice = async () => {
    OpenDrawingToolMenu(5,15);
    let findPrice = async () => {
        TimeOutWrapper(
            () => {return secondaryDocument.querySelector(".tv-floating-toolbar__widget-wrapper") == null},
            () => {

                secondaryDocument.removeEventListener("click", findPrice, true);
                openFromTargetMenu("settings");

                TimeOutWrapper(
                    () => {return !IsLoad("dialog-34XTwGTT", 0, true, secondaryDocument)},
                    () => {
                        let menu = Get("dialog-34XTwGTT", 0, true, secondaryDocument)
                        menu.querySelectorAll(".tab-1l4dFt6c")[2].click();
                        TimeOutWrapper(
                            () => {return menu.querySelector("input") == null},
                            () => {
                                price = menu.querySelector("input").getAttribute("value");
                                secondaryDocument.dispatchEvent(
                                    new KeyboardEvent("keydown", {keyCode:SHORTCUT.CLOSE_FORM})
                                )
                                secondaryDocument.dispatchEvent(
                                    new KeyboardEvent("keydown", {keyCode:SHORTCUT.CLOSE_FORM})
                                )
                                openFromTargetMenu("remove");
                                secondaryDocument.querySelector("div[class='button-dealticket__label']").click();
                                OpenAlertMenu();
                            }
                        )
                    },{alertMessage:"getPrice(1)", tolerance: 50, killswitch: true},
                    10)
            },{alertMessage:"getPrice(2)", tolerance: 50, killswitch: true},
            10
        )
    }
    secondaryDocument.addEventListener("click", findPrice, true);
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
                tradeButton.addEventListener("click",() => {
                    HidePaperPLPositionForm(false)
                    adjustSize();
                }, true);
            }
        }
        , {alertMessage: false, tolerance: 30, killswitch: true}, 10
    )
}


/**
 * Automatically adjust the risk according to the defined risk amount.
 * Intented left the place order to user(so misclick is not occur)
 */
let adjustSize = async () => {
    TimeOutWrapper(
        () => {  
            return document.getElementsByTagName("app-deal-ticket").length < 1},
        () => {
            
            let form = document.getElementsByTagName("app-deal-ticket")[0]
            let quantity = form.querySelector("app-number-input[formcontrolname='quantity']")
                                    .querySelector("input");
            form.querySelector("input[type='checkbox']").click();
            let input = form.querySelector("input[placeholder='pips']")
            input.addEventListener("change", (event)=> {
                if(input.value < ACCOUNT.minimumSL){
                    alert("Stoplost is below the minimum amount!!!!");
                }
                quantity.value = parseInt((ACCOUNT.RiskFactor *1.0 - 0.5) / (input.value * 0.0001));

                quantity.dispatchEvent(new Event("input", {
                    view: window,
                    bubbles: true,  
                    cancelable: true
                  }))
            }   , true)
            input.focus();

            let focusE = () => { if(document.activeElement != quantity);input.focus()};
            form.addEventListener("click", focusE, true)
            form.addEventListener("keydown",
                (event) => {
                    if(event.keyCode == SHORTCUT.CLOSE_FORM){
                        form.querySelector("div[class='deal-ticket-header__destroy']")
                            .click();
                    } 
                },
                true
            )
            form.querySelector(".button--submit").addEventListener("click", () => {adjustFlag=false, console.log("click")});
            form.querySelector("div[class='deal-ticket-header__destroy']").addEventListener("click", () => {adjustFlag=false, console.log("click")});
        }
        ,{alertMessage:"adjustSize", tolerance: 200, killswitch: false}),
        50
}
/**
 * Open the order, position panel to : close, adjust
 */
let openOrderAdjustment = async () => {
    TimeOutWrapper(
        () => { return !IsLoad("ag-pinned-left-cols-container")},
        () => {
            positionPage = Get("ag-pinned-left-cols-container").querySelector("span[appdropdown]");
            if(positionPage == null) 
                alert("There are no Order/Position");
            else{
                positionPage.click();
                // navigate to the amend order button
                TimeOutWrapper(
                    () => {return !IsLoad("dropdown__content", 1)},
                    () => {
                        (Get("dropdown__content", 1)).querySelector(".edit-position")
                                    .click();
                        positionPage.click();
                        // short cut to enter, exit
                        SubmitViaEnter_Exit();
                        HidePaperPLPositionForm();
                    },{alertMessage:"OrderAdjustment:: Amend click", tolerance: 200, killswitch: false}
                )
            }           
        },{alertMessage:"openOrderAdjustment", tolerance: 200, killswitch: true})
}

let inAdjustment = true;
/**
 * Once we open the adjustment form, use tab to navigate between closing feature and adjustment feature
 */
let ToggleCloseAdjust = async () => {
    TimeOutWrapper(
        () => { return document.getElementsByTagName("app-deal-ticket").length < 1},
        () => {
            lockTogglerEnable = true;
            let form = document.getElementsByTagName("app-deal-ticket")[0]

            form.addEventListener("keydown",
                (event) => {
                    if(event.keyCode == TAB){
                        form.querySelectorAll("input[formcontrolname='editAction']")
                            [(inAdjustment) ? 0 : 1].click()
                        inAdjustment = !inAdjustment;
                        if(inAdjustment)
                            HidePaperPLPositionForm();
                        form.focus();
                    } 
                    
                }, true);
        }
        ,{alertMessage:"ToggleCloseAdjust", tolerance: 200, killswitch: true})
}
//ticket-form ng-untouched ng-pristine ng-invalid ng-star-inserted
//ticket-form ng-star-inserted ng-touched ng-dirty ng-valid
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
                        () => {
                            form.getElementsByTagName("input")[3].click()
                            navigator.clipboard.writeText(price);
                            price = 0;

                        }
                    )
                },{alertMessage:"OpenAlertMenu: Focus", tolerance: 50, killswitch: true},
                30
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
        ,{alertMessage:"OpenAlertMenu", tolerance: 200, killswitch: false},
        10)
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

            form.addEventListener("click", () => { form.querySelectorAll("input")[entryInputIndex]?.focus() },true)
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
                        inAdjustment = true;
                    } 
                    if(event.keyCode == SHORTCUT.CLOSE_FORM){
                        form.querySelector("div[class='deal-ticket-header__destroy']")
                            .click();
                        inAdjustment = true;
                    } 
                }, true);
        }
        ,{alertMessage:"SubmitViaEnter_Exit", tolerance: 200, killswitch: false})
}

let isText = false;
/**
 * Target menu are from the drawing object in the canvas, by click it we will see a menu pop up
 * @param {String: use devTool from platform to see tha viable name} name 
 */
let openFromTargetMenu = async (name) =>{
    let menu = Get("tv-floating-toolbar__widget", -1, true, secondaryDocument);
    if(menu.length > 0){
        for(let i = 0; i < menu.length; i++){
            let button = menu[i].getElementsByTagName("div")[0]
            if(button.querySelector(".tv-linetool-properties-toolbar__text") != null){
                isText = true;
            }
            if(button.getAttribute('data-name') == name){
                if(name == "settings"){
                    SettingMenuHandler();
                    lockTogglerEnable = false;
                }
                // make sure no Propagation else lead to double click (left same state)
                button.addEventListener("click", (event) => {  event.preventDefault() }, true)
                button.click();
                if(isText){
                    spaceBarToggle = false;
                }
                break;
            }
        }
    }      
}
let SettingMenuHandler = async () => {
    TimeOutWrapper(
        () => {return !IsLoad("dialog-34XTwGTT", 0, true, secondaryDocument)},
        () => {
            let menu = Get("dialog-34XTwGTT", 0, true, secondaryDocument);
            let clickable = [...menu.querySelectorAll("button")]
            clickable.push(menu.querySelector("span[data-name='close']"));

            clickable.forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        lockTogglerEnable = true;
                        if(isText){
                            spaceBarToggle = true;
                            isText = false;
                        }
                    }
                    ,true)
            });
            menu.addEventListener("keydown", (event) => {
                if(event.keyCode == TAB){
                    let headerList = menu.querySelectorAll(".tab-1l4dFt6c");
                    for(let i =0; i < headerList.length; i++){
                        if(headerList[i].classList.contains("active-37sipdzm")){
                            headerList[(i + 1)%(headerList.length - 1)].click();
                            if((i + 1)%4 == 1){
                                TimeOutWrapper(
                                    () => {return menu.querySelector(".check-13mv3fTM") == null},
                                    () => {
                                        let tickbox = menu.querySelector(".input-ly-CSnj5")
                                        
                                        if(!tickbox.checked){
                                            tickbox.click();
                                        }
                                    },
                                    {alertMessage: false, tolerance: 30, killswitch: true}
                                )
                            }
                            return;
                        }
                    }
                }
                if(event.keyCode == SHORTCUT.SUBMIT_FORM){
                    clickable[1].click();
                }if(event.keyCode == SHORTCUT.CLOSE_FORM){
                    clickable[0].click(); 
                }
            }, true);
        },
        {alertMessage: false, tolerance: 50, killswitch: true}
    )
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

                if(isText){
                    TimeOutWrapper(
                        () => {return !IsLoad("dialog-34XTwGTT", 0, true, secondaryDocument)},
                        () => {
                            let menu = Get("dialog-34XTwGTT", 0, true, secondaryDocument);
                            let clickable = [...menu.querySelectorAll("button")]
                            clickable.push(menu.querySelector("span[data-name='close']"));
                
                            clickable.forEach(button => {
                                button.addEventListener(
                                    "click",
                                    () => {
                                        lockTogglerEnable = true;
                                        if(isText){
                                            spaceBarToggle = true;
                                            isText = false;
                                        }
                                    }
                                    ,true)
                            });
                            menu.addEventListener("keydown", (event) => {
                                if(event.keyCode == SHORTCUT.SUBMIT_FORM){
                                    clickable[1].click();
                                }if(event.keyCode == SHORTCUT.CLOSE_FORM){
                                    clickable[0].click(); 
                                }
                            }, true);
                        }
                    )
                }
                
            }
        },{alertMessage:"OpenDrawingTool", tolerance: 200, killswitch: false}
    )
}

let remain = 0 
let coors = [];
let img = null;
let blockBySnipper = false;
let toolBarWidth = 0;                         
let find_coor = (event) => {    
        
        if(event.target.tagName == "CANVAS" ){
            
            let mainCanvasWidth = secondaryDocument.querySelector("canvas").offsetWidth
            let mainCanvasHeight = secondaryDocument.querySelector("canvas").offsetHeight
            toolBarWidth = secondaryDocument.querySelector(".inner-1xuW-gY4").offsetWidth;
            let tempWidth = mainCanvasWidth + toolBarWidth
            coors.push({
                x: (event.clientX < tempWidth)
                    ? (event.clientX > toolBarWidth) ? event.clientX - toolBarWidth : 0
                    : mainCanvasWidth,
                y:(event.clientY < mainCanvasHeight) ? event.clientY : mainCanvasHeight
            })
            remain--;
            if(remain == 0 || coors.length == 2){
                //destroyVisualiser(secondaryDocument);
                secondaryDocument.removeEventListener("click", find_coor, true);
                SaveImage(coors, mainCanvasHeight);
                coors = [];
                remain = 0;
            }else{
                createVisualiser(secondaryDocument, coors[0])
            }
        }
    }

let endSnip = () => {
    remain = 0;
    destroyVisualiser()
    secondaryDocument.removeEventListener("click", find_coor, true);
    secondaryDocument.removeEventListener("contextmenu", rightClickHandler, true)
    coors = [];
    remain = 0;
    blockBySnipper = false;
}
/**
 * Credit: Function found on external 
 * source (https://sentry.io/answers/how-do-i-copy-to-the-clipboard-in-javascript/#:~:text=Copying%20an%20Image%20to%20the%20Clipboard&text=To%20write%20an%20image%20to,()%20method%20on%20the%20response.)
 * @param {*} imgUrl 
 */
async function copyImgToClipboard(imgUrl) {
    try {
      const data = await fetch(imgUrl);
      const blob = await data.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      console.log('Image copied.');
    } catch (err) {
      console.error(err.name, err.message);
    }
  }
let NewScreenshotHandler = (event) => {
    let finishFlag = false;
    if(event.keyCode == SHORTCUT.SUBMIT_FORM){
        
        
        /**
         * @todo: write the send method that hangling sending the img
         */
        finishFlag= true;
        copyImgToClipboard(img.src);
    }
    if(event.keyCode == SHORTCUT.CLOSE_FORM){
        alert("abort")
        finishFlag = true;
    }
    if(finishFlag){
        blockBySnipper = false;
        if(img!=null) document.querySelector("app-workspace-panel").removeChild(img)
        img = null;
        document.removeEventListener("keydown", NewScreenshotHandler, true)
    }
}
let SaveImage = (coors, maxHeight) => {
    let canvas = secondaryDocument.querySelector("canvas")
    let newCanvas = document.createElement("canvas");
    let context = newCanvas.getContext('2d');
    newCanvas.width = Math.abs(coors[1].x - coors[0].x);
    newCanvas.height = Math.abs(coors[1].y - coors[0].y);
    context.drawImage(canvas, Math.min(coors[0].x,coors[1].x ), Math.min(coors[0].y,coors[1].y ), newCanvas.width, newCanvas.height, 0, 0,  newCanvas.width, newCanvas.height)
    //console.log(newCanvas.toDataURL('png'))
    img = document.createElement("img");
    img.src = newCanvas.toDataURL('png')
    img.style["max-height"] = `${maxHeight *1.0 /2.0}px`;
    img.style["object-fit"] = "contain";
    
    document.querySelector("app-workspace-panel").prepend(img);
    document.addEventListener("keydown", NewScreenshotHandler, true)
}

let SnipCanvas = () => {
    remain = 2;
    blockBySnipper = true;
    secondaryDocument.addEventListener("click",  find_coor, true)
    secondaryDocument.addEventListener("contextmenu", endSnip, true)
}

/**
 * Code gotten from StackOverFlow (https://medium.com/@impulsejs/convert-dataurl-to-a-file-in-javascript-1921b8c3f4b)
 * @param {*} dataurl 
 * @param {*} filename 
 * @returns 
 */
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }