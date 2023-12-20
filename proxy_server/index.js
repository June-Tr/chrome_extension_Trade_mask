/**
 * @todo: cache the most recent entry, exit pair : use that to ensure that all order is fullfil
 */
require('dotenv').config()

// Notion SDK for JavaScript
const express = require("express");
const app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const https = require("https")
const { Client } = require("@notionhq/client")
;
let NotionKey = process.env.NOTION_API_KEY;
let databaseId =process.env.NOTION_PAGE_ID;
const notion = new Client({ auth: NotionKey});
;

let cache = {
  title: "",
  entry: null,
  exit: null,
  size: null,


}
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// wait for full data to complete before send
app.get("/:time/:dir/:id/:exit_id/:size/:price/:pattern", (req, res) => {
  let buffer = req.params.pattern.split(',')
  cache.pattern = [];
  for (p of buffer){
    cache.pattern.push({"name": p});
  }
  req.params.time = req.params.time.replaceAll('-', '/')

  cache.title = req.params.time;
  cache.size = (req.params.dir == "bull") ? `+${req.params.size}`:`-${req.params.size}`
  cache.entry = req.params.id;
  cache.exit =  req.params.exit_id;
  cache.price = req.params.price;
  
  console.log(cache.pattern)
  addOrder(cache)
 
})
app.listen(5000, () => {
  console.log(`Example app listening on 5000`)
})
let addOrder = async () => {
  
  await notion.pages.create(
    {
      parent:{ database_id: databaseId},
      properties: {
        "Price {s, e}": {
          
          "rich_text": [
              {
                  "text": {
                      "content": cache.price
                  }
              }
          ]
        },
        "Entry": {
          "rich_text": [
              {
                  "text": {
                      "content": cache.entry
                  }
              }
          ]
        },
        "Exist": {
          "rich_text": [
              {
                  "text": {
                      "content": cache.exit
                  }
              }
          ]
        },"size": {
          "rich_text": [
              {
                  "text": {
                      "content": cache.size
                  }
              }
          ]
        },
        "Name": {
          type: "title",
          title: [{ type: "text", text: { content: cache.title } }],
        },
        "Candle-stick pattern":{
           "multi_select" :  cache.pattern
        }
      }
    }
    
  )
  cache = {
    title: "",
    entry: null,
    exit: null,
    size: null,
    dir: null

  }
}


