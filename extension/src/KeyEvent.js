/**
 * There are 3 event:
 * (1) : The inititial prep phase + rewritten phase complete <- PageLOAD
 * (2) : The Position status is updated (enter a position, exist one) <-Position.Change
 * (3) : The main work page is reloaded (all the artifact need to be up to date) <- Reload
 */

// button artifact will be added after fully rerender the page
cache.Load._callbackOnPageLoad.push(
    () => {       
        cache.buttons = new Button();
        cache.Position._callbackOnChange.push(() => cache.buttons.react());
    }
)
let initLoad =true;
// once the page is load, add the listen event for the close position click
// cache.Main._cbOnMainReload.push(
//     // since we look 
//     () => {
//         TimeOutWrapper(
//             () => {
//                 // check if the header tab loaded and reader to be scrap
//                 PotentialIssueAlert("Add closing handler")
//                 return !IsLoad("ag-pinned-right-cols-container")
//             },
//             () => {
//                 let positionPage = Get("ag-pinned-right-cols-container");
//                 console.log(positionPage)
//                 let observer = new MutationObserver(() => {
//                     if(initLoad){
//                         return initLoad=false;
//                     }
//                     IsInOpenPosition(
//                         () => {
//                             console.log("entry");
//                         },
//                         () => {
//                             console.log("exit")
//                         }
//                     )
//                 })
//                 observer.observe(positionPage,
//                     { attributes: true, childList: true, subtree: true }
//                     )
//             }
//         )
//     }
// )

cache.Load._callbackOnPageLoad.push(
    NavShortCut
);

// once the page is load, check for open position
cache.Load._callbackOnPageLoad.push(
    () => {
        IsInOpenPosition(
            // we want to extract and caching the information
            ExtractImportancePositionDetail,
                () => {
                    // since we stay on the main page we need to tell the system, that the main page is load.
                    NavTo(CONFIG.MainWS);
                });
    }    
)

cache.Main._cbOnMainReload.push(
    canvasListener
)
//cache.Load._callbackOnPageLoad.push(cache.Position.test);
