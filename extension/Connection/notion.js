let Order_URL = `http://localhost:5000/Order`
let Trade_URL = `http://localhost:5000/Trade`
let Orders_day_RUL = `http://localhost:5000/Many/Intraday/_Order`
let sampleData = {
    id: "id2",
    label: "Open",
    market: "Eur_usd",
    date: {
        "start": "2022-02-14",
        "end": "2022-02-18"
    },
    price: "1000",
    size: "33",
    curency: "Usd",
    type: "Buy"
}
let tradeData = {
    entry: "id",
    exit: "id2",
    pattern: "Long",
    description: "testing only",
    link: "https://stackoverflow.com/questions/67908631/api-relation-property"
}

let formFetchConfig = (data) => {
    return{
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    }
} 
let SendOrder = async (data) => {
    console.log(await fetch(Order_URL,formFetchConfig(data))
    );
        
}
let SendTrade = async (data) => {
    console.log("trad++++++++++++++++++++++++++++++++")
    console.log(await fetch(Trade_URL,formFetchConfig(data)));       
}

let SendManyOrder = async(data) => {
    console.log(await fetch(Orders_day_RUL,formFetchConfig(data)));
}
