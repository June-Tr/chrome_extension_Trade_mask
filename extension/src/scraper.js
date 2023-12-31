/**
 * @todo: add a handler to log the previous trade
 */
/**
 * @todo: pottentially add a method to pre-process to keep track of the index of all tab on the 
 * main work space
 */
// check for position:
// - swap the button text with the entry price.

let IsInOpenPosition = async (OnPositionCb, NoPositionCb = () => {}) => {
    // check for postion
    TimeOutWrapper(
        () => {return !IsLoad(CONFIG.Html.POSITION, 2)},
        () => {
            // if there are no position, the header of the page will be "Position (0)"
            // else "Position (n)" where n is the number of trade :: n_trade >= 0
            // to suit my trading system, i will only have 1 position active at a time
            let n_trade = Get(CONFIG.Html.POSITION, 2)
                            .getElementsByTagName("span")[0] // <span> Position (n_trade) </span>
                            .innerText.match(/([0-9][0-9]*)/g); // extract n_trace

            // if the title is not completely loaded, try again later
            if(n_trade == null)
                SleepAndRerun(() => IsInOpenPosition(OnPositionCb, NoPositionCb), 30)
            else
                (n_trade > 0)
                    ? OnPositionCb()
                    : NoPositionCb()

        },{alertMessage:"IsInOpenPosition", tolerance: 200, killswitch: true},
        30
    )
}


let ExtractImportancePositionDetail = async () => {
    TimeOutWrapper(
        () => { return !IsLoad(CONFIG.Html.POS_detail, 1)},
        () => {
            let row = Get(CONFIG.Html.POS_detail, 1);
            
            var info = {
                id: row.innerText.split('\n')[2],
                dir: row.innerText.match(/(Buy)*(Sell)*/g)[0]
            }    
            if(info.id == undefined)
                SleepAndRerun(ExtractImportancePositionDetail, 100)
            else
                NavTo("History", () =>{
                    ExtractPrice((found) => {
                        // complete gather information
                        for(order of found){
                            if(order.id == info.id){
                                cache.Position.state = true;
                                cache.Position.direction = info.dir;
                                cache.Position.entry = info.id;
                                cache.Position.price = order.price;
                                break;
                            }
                        }
                        // this call back will be executed if and only if we able to navigate to History ws in the first place.
                        // then we must then we must return to the main work space (default) before do anything else
                        // in this case: notify that the position state is changing
                        NavTo(CONFIG.MainWS, cache.Position.Change);
                    }), 20}
                )
            
        },{alertMessage:"ExtractImportancePositionDetail", tolerance: 100, killswitch: true},
        30 );       
}


/**
 * A promise that will call cb on 10 or less order from history
 * @param {that will be call with cb(found_position)} cb 
 * @param {extra arguement for the cb} arg 
 * @param {intented to be call internally} _Secondcast 
 */
let ExtractPrice = async (cb, arg) => {
    
    TimeOutWrapper(
        () => {return !IsLoad("ag-center-cols-container")},
        () => {
            let container = (Get("ag-center-cols-container"));
            // not fully loaded
            if(container.children.length < 1 || container.children[0].innerText.split("\n").length <5){
                SleepAndRerun(() => ExtractPrice(cb, arg), 50)
            }
            else{               
                let found = [];
                let order = {}
                // extra the position
                let length = (container.children.length < 10)? container.children.length: 10;
                
                for(let i =0; i < length; i++){
                    order = container.children[i].innerText.split("\n");
                    found.push({
                            size: order[2],
                            date: order[0],
                            price: order[3],
                            direction: order[1],
                            id: order[4]
                        }
                    )       
                }cb(found, arg)
            }

        },{alertMessage:"ExtractPrice", tolerance: 100, killswitch: true}
    )
}

let extractDate = (date) => {
    let result = {};
    let dateStr = date;
    dateStr = dateStr.split(" ");
    dateStr.forEach(
        subStr => {
            if(subStr.includes("/")){
                let b = subStr.split("/");
                result.y = b[2];
                result.m = b[1];
                result.d = b[0]
            }else{
                let b = subStr.split(":");
                result.h = b[0];
                result.m = b[1];
                result.s = b[2];
            }
        }
    )
    console.log(result)
    return result;
}
let ExtractPastPosition = async (onDate) => {
    NavTo(
        "History",
        () => {
            ExtractPrice((found, arg) => {
                const {year, month, day} = onDate;
                console.log(found[0])
                let dateStr = found[0].date;
                dateStr = dateStr.split(" ")[0];
                dateStr = dateStr.split("/")
                let orders = [];
                console.log(new Date(found[0].date));
                found.forEach(o => {
                    if(o.date.includes(`${day}/${month}/${year}`)){
                        let d = extractDate(o.date);
                        let date = new Date(
                            d.y, d.m, d.d, d.h, d.m, d.s
                        ).toISOString();
                        console.log(date)
                        let replica = {...o, date: {start:date}, type: o.direction, market: "Eur_usd", label:"_", curency:"Usd"}
                        orders.push(replica);
                    }
                });
                SendManyOrder({
                    date: onDate,
                    orders: orders
                })
                NavTo(CONFIG.MainWS);
            })
        }
    )
}