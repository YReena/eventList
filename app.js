const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const  session = require('express-session');
const path = require('path');

dotenv.config({path :'./config.env'});
app.use(express.json());


app.use(session({
    secret: 'Reena_Yadav@12345',
    resave: false,
    saveUninitialized: false,
  }));
  //console.log(session);

// app.use(express.static(path.join(__dirname,"./client/build")));

// app.get("*",(req,res)=>{
//   res.sendFile(path.join(__dirname,"./client/build"));
// })
// require('./db/conn');
// app.use(require('./router/router'));

app.use(express.static(path.join(__dirname,"./client/build")));

app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"./client/build"));
})
require('./db/conn');
app.use(require('./router/router'));


app.listen(8000,(req,res)=>{
    console.log("server is running at 8000");
})
