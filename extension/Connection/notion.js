let Order_URL = `http://localhost:5000/Order`
let Trade_URL = `http://localhost:5000/Trade`

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
let SendOrder = async (data) => {
    console.log(await fetch(Order_URL,
        {
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
        })
    );
        
}
let SendTrade = async (data) => {
    console.log(await fetch(Trade_URL,
        {
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
        })
    );
        
}