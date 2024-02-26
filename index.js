const express = require('express');
const connection = require('./database');
const identify = require('./route/Identify.js');
const purchase = require('./route/purchase.js');
require('dotenv').config();
const app= express();
const port = process.env.PORT;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/identify', identify);
app.use('/purchase', purchase);
app.listen(port, (req,res)=>{
    console.log(`Running on ${port}!!`)
    connection.connect(function(err) {
        if (err) console.log(err);
        else {
            console.log("Connected to MySQL");
        }
    });
})