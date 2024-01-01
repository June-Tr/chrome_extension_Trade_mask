require('dotenv').config()
const { Client } = require("@notionhq/client");
let NotionKey = process.env.NOTION_API_KEY;
let OrderDB =process.env.NOTION_ORDER_ID;
let TradeDB =process.env.NOTION_TRADE_ID;
const notion = new Client({ auth: NotionKey});

let cache= {
    order : new Map()
}
let searchWTitle = async (db, title) => {
    let titleBuffer = []
    title.forEach((t) => {
        titleBuffer.push({
            property: "Position id",
            title: {
              "contains": t
            }
          })
    })
    const response =  await notion.databases.query({
        database_id: db,
        filter: {
          "or": titleBuffer
        },
      });
      return response.results
}
let searchWDate = async (db, date) => {
    const {year, month, day} = date;
    console.log(`${year}-${(month < 10 ? "0" + month: month)}-${(day < 10 ? "0" + day: day)}`)
    const response =  await notion.databases.query({
        database_id: db,
        filter:"and" [ 
                {
                    "property": "Open Date & Time",
                    "date": {
                        "after": `${year}-${(month < 10 ? "0" + month: month)}-${((day-1) < 10 ? "0" + (day-1): (day-1))}`
                    }
                },{
                    "property": "Open Date & Time",
                    "date": {
                        "before": `${year}-${(month < 10 ? "0" + month: month)}-${((day+1) < 10 ? "0" + (day+1): (day+1))}`
                    }
                }
            ]
      });

      let res = []
      response.results.forEach(o => {
        res.push(o.properties['Position id'].title[0].text.content);
      })
      return res
}
let SendOrder = async (order) => {
    console.log("send order===")
    console.log(order)
    const {id, label, market, date, price, size, curency, type} = order;
    console.log(`${id}, ${label}, ${market}, ${date}, ${price}, ${size}, ${curency}, ${type}`)
    let res = await notion.pages.create(
        {
            parent:{ database_id: OrderDB},
            properties: {
                "Position id":{
                    type: "title",
                    title: [{ type: "text", text: {content: id}}]
                },
                "Label": {
                    "select": {"name":label}
                },
                "Market": {
                    "select": {"name": market}
                },
                "Open Date & Time": {
                    "date": date
                },
                "Price": {
                    "rich_text": [
                        {
                            "text": {
                                "content": price
                            }
                        }
                    ]
                },
                "Size": {
                    "rich_text": [
                        {
                            "text": {
                                "content": size
                            }
                        }
                    ]
                },
                "Trade Ccy": {
                    "select": {"name": curency}
                },
                "Type": {
                    "select": {"name":type}
                },
            },
        }
    )

    cache.order.set(id, res.id);
}
/**
 * Like the Time out but this case, sleep once
 * @param {*} cb 
 * @param {*} time 
 */
let SleepAndRerun = async (cb, time = 100) => {
    let id = setTimeout(() => { 
        clearTimeout(id);
        cb();
    }, time);
}


let SendTrade = async (trade,res, initFlag=true) => {
    const {entry, exit, pattern ,description, link} = trade;

    // let buffer = await searchWTitle(OrderDB, [entry, exit]);
    let entryId = null;
    let exitId = null;
    if(cache.order.get(entry) == undefined ||
        cache.order.get(exit) == undefined){
        // the order might exist in the database
        if(initFlag){
            initFlag = !initFlag;
            let buffer = await searchWTitle(OrderDB, [entry, exit]);
            if(buffer.length != 0){
                //we found some information
                for(let i =0; i < buffer.length; i++){
                        if(buffer[i].properties["Position id"].title[0].text.content == entry){
                            cache.order.set(entry, buffer[i].id)
                        }else{
                            cache.order.set(exit, buffer[i].id)
                        }
                    }
            }
        }
        return SleepAndRerun(() => SendTrade(trade, res, false), 500);
    }

    entryId = cache.order.get(entry) 
    exitId = cache.order.get(exit) 


    let data = {
        parent:{ database_id: TradeDB},
        properties: {
            "EntryOrder":{
                type: "title",
                title: [{ type: "text", text: {content: entry}}]
            },
            "Entry":{
                "relation": [{"id":entryId}]
            },
            "Exit":{
                "relation": [{"id":exitId}]
            },
            "Candlestick Pattern":{
                "multi_select" :  [{"name": pattern}]
             }
        },
        "children": [
            {
                "object": "block",
                "paragraph": {
                    "rich_text": [
                        {
                            "text": {
                                "content": description
                            }
                        }
                    ]
                }
            }
        ] 
    }
    if(link != undefined){
        data["children"][0].paragraph.rich_text[0].text.link = { url : link};
        data["children"][0].paragraph.rich_text[0].href = link;
    }
    
    let val = JSON.stringify({url:(await notion.pages.create(
        data
    ))});
    console.log(`response: ${res.body}`)
    res.send(val);
}

let SendOrderWrapper = async (order) => {
    let result = await searchWTitle(OrderDB, [order.id]);

    console.log(result);
    if(result.length ==  0){
        SendOrder(order);
    }
}

let updateIntraDayOrder = async (day, orders) => {
    let result = (await searchWDate(OrderDB, day))

    for(let i = 0; i< orders.length; i ++){
        if(!result.includes(orders[i].id)){
            SendOrder(orders[i]);
        }
    }
}
module.exports =  {SendOrder, SendTrade, updateIntraDayOrder, SendOrderWrapper};