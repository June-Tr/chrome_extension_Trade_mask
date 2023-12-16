
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