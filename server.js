// import and set up
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
//const SQL = require('./DB/DB');
const port = 1717;
app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//routing
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, "views/index.html"));
});


app.get('/SignUp', (req,res)=>{
    res.sendFile(path.join(__dirname, "views/SignUp.html"));
});

app.get('/LogIn', (req,res)=>{
    res.sendFile(path.join(__dirname, "views/LogIn.html"));
});

app.get('/page3', (req,res)=>{
    res.sendFile(path.join(__dirname, "views/page3.html"));
});

app.post('/page3', (req,res)=>{
    res.sendFile(path.join(__dirname, "views/page3.html"));
});

app.get('/LogIn', (req,res)=>{
    res.sendFile(path.join(__dirname, "views/LogIn.html"));
});


app.post('/findbeer', (req,res)=>{
    res.sendFile(path.join(__dirname, "views/page4.html"));
});

app.get('/page5', (req,res)=>{
    res.sendFile(path.join(__dirname, "views/page5.html"));
});


//set up listen
app.listen(port, ()=>{
    console.log("server is running on port",port);
});

