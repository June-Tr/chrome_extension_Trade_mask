
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
                console.log(positionPage)
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

// once the page is load, check for open position
cache.Load._callbackOnPageLoad.push(
    () => {
        IsInOpenPosition(
            // we want to extract and caching the information
            ExtractImportancePositionDetail);
    }
    
)

cache.Load._callbackOnPageLoad.push(cache.Position.test);