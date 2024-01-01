const express = require("express");
const app = express();
const {SendOrder, SendTrade, updateIntraDayOrder,SendOrderWrapper} = require( './notion.js');
require('dotenv').config()

const https = require("https")
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://trade.loginandtrade.com');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers",
         "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method,, Access-Control-Request-Headers"); 
    next();
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.listen(5000, () => {
    console.log(`Example app listening on 5000`)
})

app.post('/Order', (req, res) => {
    console.log("Order")
    const order = req.body;
    res.body = JSON.stringify({value: "return message"})
    res.send()
    SendOrderWrapper(order);
})

app.post('/Trade', async (req, res) => {
    console.log("Trade")
    const trade = req.body;
    
    //console.log(trade)

    await SendTrade(trade, res, true);
    console.log("Complete work flow----------------")
})


app.post("/Many/Intraday/_Order", async (req, res) => {
    console.log("Update Intraday Order");
    console.log(req.body);
     await updateIntraDayOrder(
        req.body.date,
        req.body.orders
    )
})