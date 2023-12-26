require('dotenv').config()
const { Client } = require("@notionhq/client");
let NotionKey = process.env.NOTION_API_KEY;
let OrderDB =process.env.NOTION_ORDER_ID;
let TradeDB =process.env.NOTION_TRADE_ID;
const notion = new Client({ auth: NotionKey});

let SendOrder = async (order) => {
    console.log(order)
    const {id, label, market, date, price, size, curency, type} = order;
    console.log(`${id}, ${label}, ${market}, ${date}, ${price}, ${size}, ${curency}, ${type}`)
    await notion.pages.create(
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
}

let searchWTitle = async (db, title) => {
    const response =  await notion.databases.query({
        database_id: db,
        filter: {
          property: "Position id",
          title: {
            "equals": title
          }
        },
      });
      return response.results[0].id
}
let SendTrade = async (trade) => {
    const {entry, exit, pattern ,description, link} = trade;
    let entryId = await searchWTitle(OrderDB, entry);
    let exitId = await searchWTitle(OrderDB, exit);


    await notion.pages.create(
        {
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
                                    "content": description,
                                    "link": {
                                        "url": link
                                    }
                                },
                                "href": link
                            }
                        ]
                    }
                }
            ] 
        }
    )
}

module.exports =  {SendOrder, SendTrade};