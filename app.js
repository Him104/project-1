const express = require('express');
const bodyParser = require("body-parser");
const route = require('./routes/route.js');
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect(process.env.mongo_uri)

.then( () => console.log("Mongo is connected"))

.catch(err => console.log(err))

app.use('/', route); 


app.listen(process.env.PORT || 8000, function () {

    console.log(`Blogging Server running on port ` + (process.env.PORT || 8000 ));
    
})