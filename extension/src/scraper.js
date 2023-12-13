/**
 * @todo: pottentially add a method to pre-process to keep track of the index of all tab on the 
 * main work space
 */
// add the state to cache
// -1: Short
// +1 : Long
//  0 : no position
cache.state = 0;

// check for position:
// - swap the button text with the entry price.

let IsInOpenPosition = async () => {
    // check for postion
    TimeOutWrapper(
        () => {
            // check if the header tab loaded and reader to be scrap
            
            return !IsLoad(CONFIG.Html.POSITION, 2)
        },
        () => {
            // if there are no position, the header of the page will be "Position (0)"
            // else "Position (n)" where n is the number of trade :: n_trade >= 0
            // to suit my trading system, i will only have 1 position active at a time
            let n_trade = Get(CONFIG.Html.POSITION, 2)
                            .getElementsByTagName("span")[0] // <span> Position (n_trade) </span>
                            .innerText.match(/([0-9][0-9]*)/g); // extract n_trace

            // if the title is not completely loaded, try again later

            if(n_trade == null){
                let timeOutID= setTimeout(() => { 
                    clearTimeout(timeOutID);
                    return IsInOpenPosition();
                }, 50);
            }else{
                if(n_trade > 0){
                    ExtractImportancePositionDetail();
                }
            }

        }
    )
}


let ExtractImportancePositionDetail = () => {
    TimeOutWrapper(
        () => {
            return !IsLoad(CONFIG.Html.POS_detail)
        },
        () => {
            let row = Get(CONFIG.Html.POS_detail, 1);
            
            let info = {
                id: row.innerText.split('\n')[2],
                dir: row.innerText.match(/(Buy)*(Sell)*/g)[0]
            }     
            ExtractPrice((found, info) => {
                for(order of found){
                    
                    if(order.id == info.id){
                        console.log(order);

                        break;
                    }
                }
                // complete gather information
                NavTo(CONFIG.MainWS);

            }, info, false);       
        }
    )
}

/**
 * A promise that will call cb on 10 or less order from history
 * @param {that will be call with cb(found_position)} cb 
 * @param {extra arguement for the cb} arg 
 * @param {intented to be call internally} _Secondcast 
 */
let ExtractPrice = (cb, arg, _Secondcast=true) => {
    if(!_Secondcast) NavTo("History");
    TimeOutWrapper(
        () => {
            // check if the page is loaded
            return !IsLoad("ag-center-cols-container")
        },
        () => {
            let container = (Get("ag-center-cols-container"));
            
            // not fully loaded
            if(container.children.length < 1){
                let timeOutID= setTimeout(() => { 
                    clearTimeout(timeOutID);
                    ExtractPrice(cb, arg);;
                }, 50);
            }
            else{               
                let found = [];
                let order = {}
                // extra the position
                let length = (container.children.length < 10)? container.children.length: 10;
                for(let i =0; i < length; i++){
                    
                    order = container.children[i].innerText.split("\n");
                    found.push(
                        {
                            date: order[0],
                            price: order[3],
                            id: order[4]
                        }
                    )       
                }
                cb(found, arg)
            }

        }
    )
}