// button artifact will be added after fully rerender the page
cache.Load._callbackOnPageLoad.push(
    () => {       
        cache.buttons = new Button();
        cache.Position._callbackOnChange.push(() => cache.buttons.react());
    }
)

// once the page is load, add the listen event for the close position click
cache.Load._callbackOnPageLoad.push(
    // since we look 
    () => {
        TimeOutWrapper(
            () => {
                // check if the header tab loaded and reader to be scrap
                PotentialIssueAlert("Add closing handler")
                return !IsLoad("ag-root-wrapper-body")
            },
            () => {
                let positionPage = Get("ag-root-wrapper-body")
                positionPage.addEventListener(
                    "click",
                    () => {
                        console.log("Event trigger: click some where")
                        IsInOpenPosition(() => {},
                            () => {
                                // if no position, mean that we have close it all. then we can reset
                                // all page artifact to be consistence with no open position (if there a inconsitency)
                                if(cache.Position.state)
                                    cache.Position.reset();
                            }
                        )
                    }
                )
            }
        )
    }
)
cache.Load._callbackOnPageLoad.push(
    NavShortCut
);

// once the page is load, check for open position
cache.Load._callbackOnPageLoad.push(
    () => {
        IsInOpenPosition(
            // we want to extract and caching the information
            ExtractImportancePositionDetail);
    },
    () => {
        // since we stay on the main page we need to tell the system, that the main page is load.
        NavTo(CONFIG.MainWS);
    }
)

cache.Main._cbOnMainReload.push(
    canvasListener
)
//cache.Load._callbackOnPageLoad.push(cache.Position.test);
