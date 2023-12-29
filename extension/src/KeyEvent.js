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
