// import and set up
const express = require('express');
const path = require('path');
const app = express();
const DB = require("./DB/DB")
const bodyParser = require('body-parser');
const SQL = require('./DB/DB');
const CRUD = require ('./DB/CRUD');
const csvto = require('csvtojson');
const fs = require('fs');
const { random } = require('lodash');
const csv = require('fast-csv');
const session = require('express-session');

const port = 3000;
app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



app.use(session({
    secret: 'my super secret', // this should be a random string
    resave: false,
    saveUninitialized: false
  }));
//routing


app.all('/findTheRightBeer', CRUD.findTheRightBeer);
//------    ------ - - - - - - - - -
app.all('/solution',(req, res) => {
    CRUD.solution().then(results => {
        console.log(results);
const name=results[0].name;
const producer=results[0].producer;
const type=results[0].type;
const origin=results[0].origin;
const flavor=results[0].flavor;
const category=results[0].category;
const comment=results[0].comment;
const alcohol=results[0].alcohol;
        const responseData = {
            name,
            producer,
            type,
          origin,
          flavor,
          category,
          comment,
          alcohol
        };
        console.log (responseData)
        res.json(responseData);
      })
      .catch(err => {
        console.error('Error while calculating', err);
        res.status(500).json({ error: 'Internal server error'});
   });
  });

app.get('/', CRUD.createBeersTable);

app.get('/insertData', CRUD.insertData);

app.get('/index',(req,res)=>{
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get('/SignUp', (req,res)=>{
    res.sendFile(path.join(__dirname, "views/SignUp.html"));
});

app.all('/ChekLogIn', CRUD.loginUser);

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


app.all('/findbeer', (req,res)=>{
    res.sendFile(path.join(__dirname, "views/page4.html")
    );
});

app.get('/page5', (req,res)=>{
    res.sendFile(path.join(__dirname, "views/page5.html"));
});


app.all('/DropTables',CRUD.dropTables);
//----------------------------------------------------------------------------------------------


app.all('/createSignUPTable', CRUD.createSignUPTable);
app.all('/createNewUser', CRUD.createNewUser);


//------------------------------------------------------------------------------------------



//set up listen
app.listen(port, ()=>{
    console.log("server is running on port",port);
});

//--------------------------------------------------------------------------------------------------