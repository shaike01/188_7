const path = require('path');
const sql = require('./DB');
const cookie = require('cookie-parser');
const csvto = require('csvtojson');
const bodyParser = require('body-parser');
const fs = require('fs');
const { random } = require('lodash');
const csv = require('fast-csv');
const express = require('express');
const session = require('express-session');
const app = express();

//tables creation -------------------------------------------------------------------------------------------------
const createSignUPTable = (req, res) => {
    const createTableQuery = 'CREATE TABLE IF NOT EXISTS `Users` (email varchar(255) NOT NULL, name varchar(255) NOT NULL, password varchar(255) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8';
    sql.query(createTableQuery, (err, mysqlres) => {
        if (err) {
            console.log(err);
            res.status(400).send("Cannot create users table");
            return;
        }
        console.log("Created users table");
        res.redirect("/SignUp");
    });
};


const createBeersTable = (req, res) => {
    const query = 'CREATE TABLE IF NOT EXISTS beers (name VARCHAR(255) NOT NULL, producer VARCHAR(255) NOT NULL,type VARCHAR(255) NOT NULL,origin VARCHAR(255) NOT NULL,flavor VARCHAR(255) NOT NULL,category VARCHAR(255) NOT NULL,comment VARCHAR(255) NOT NULL,alcohol INT NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;'
  
    sql.query(query, (err, mysqlres) => {
      if (err) {
            console.log(err);
            res.status(400).send("Cannot create beers table");
            return;
      }
      console.log("Created Beers table");
      res.redirect("/insertData");
    });
  };



  //insert data-------------------------------------------------------------------------------------
  const insertData = (req, res) => {
    const csvPath = path.join(__dirname, "beers.csv");
  
    csvto()
      .fromFile(csvPath)
      .then((jsonObj) => {

        for (let i = 0; i < jsonObj.length; i++) {
          const element = jsonObj[i];
    
          const newBeerData = {
            name: element.name,
            producer: element.producer,
            type: element.type,
            origin: element.origin,
            flavor: element.flavor,
            category: element.category,
            comment: element.comment,
            alcohol: element.alcohol  // add this line
          };
  
          const insertQuery = "INSERT INTO beers SET ?";
          sql.query(insertQuery, newBeerData, (err, mysqlres) => {
            if (err) {
              throw err;
              console.log(error);
            }
          });
        }
        console.log("all data inserted");
        res.redirect("/index")
      })
  };




//new data creation--------------------------------------------------------------------------------------------------------------

const createNewUser = (req, res) => {
    const NewSignUp = {
        Email: req.body.Email,
        Name: req.body.Name,
        Password: req.body.Password
    };

    const checkQuery = 'SELECT * FROM Users WHERE Email = ?';
    sql.query(checkQuery, NewSignUp.Email, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong', error: err });
            return;
        }

        if (result.length > 0) {
            console.log('This email is already in use.');
            //res.status(409).json({ message: 'This email is already in use.' });
            res.redirect('/LogIn');
            return;
        }

        const insertQuery = 'INSERT INTO Users SET ?';
        sql.query(insertQuery, NewSignUp, (err, mysqlres) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Something went wrong', error: err });
                return;
            }

            console.log(mysqlres);
            res.redirect("/page3");

        });
    });
};
//chek login--------------------------------------------------------------------------------------------
const loginUser = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const selectQuery = 'SELECT * FROM Users WHERE Email = ? AND Password = ?';
    sql.query(selectQuery, [email, password], (err, result) => {
        if (err) {
         console.log(email)
            console.error(err);
            return res.status(500).send({
                message: 'Error occurred while retrieving user',
                error: err
            });
        }

        if (result.length > 0) {
            // User exists, authentication successful
            res.redirect('/page3');
        } else {
            res.send('No user found with the provided email and password, please sign in or try again');
           
           

        }
    });
};

//the main function to fins beers------------------------------------------------------------------------




const findTheRightBeer = (req, res) => {
    const {Beer_Type, flavor, range, country, Type} = req.body;

    // Create the beersFound table if it does not already exist
    const createTableQuery = 'CREATE TABLE IF NOT EXISTS beersFound (name VARCHAR(255) NOT NULL, producer VARCHAR(255) NOT NULL,type VARCHAR(255) NOT NULL,origin VARCHAR(255) NOT NULL,flavor VARCHAR(255) NOT NULL,category VARCHAR(255) NOT NULL,comment VARCHAR(255) NOT NULL,alcohol INT NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;';

    sql.query(createTableQuery, (err, result) => {
        if(err) {
            console.log(err);
            return;
        }
        console.log("Table created/already exists");
    });

    // Construct the base SQL query
    let s = `SELECT * FROM beers WHERE type=? AND flavor=? AND alcohol<=?`;
    const values = [Beer_Type, flavor, range];

    if (country && country !== "none") {
        s += " AND origin=?";
        values.push(country);
    }

    if (Type) {
        s += " AND category=?";
        values.push(Type);
    }

    s += " ORDER BY RAND() LIMIT 1";

    sql.query(s, values, (err, mysqlres) => {
        if (err) {
            console.log(err);
            return;
        }
        else if (mysqlres.length === 0) {
            console.log('No beer found');
        } else {
            const randomBeer = mysqlres[0];
            console.log(randomBeer);
            req.session.beer = randomBeer;

            // Insert the selected beer into the beersFound table
            let insertQuery = `INSERT INTO beersFound (name, producer, type, origin, flavor, category, comment, alcohol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            let insertValues = [randomBeer.name, randomBeer.producer, randomBeer.type, randomBeer.origin, randomBeer.flavor, randomBeer.category, randomBeer.comment, randomBeer.alcohol];

            sql.query(insertQuery, insertValues, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Beer inserted into beersFound table");
            });
        }
        // Move the redirection here
        res.redirect("/findbeer");
    });
};

const solution = (req, res) => {
    return new Promise((resolve, reject) => {
        const theQuery ="SELECT * FROM beersFound ORDER BY Name DESC LIMIT 1;"
        sql.query(theQuery, (err, results) => {
            if (err) {
                console.error('Something went wrong taking out', err);
                reject(err);
            } else {
                console.log(results);
                resolve(results);
            }
        });
    });
};


const dropTables = (req, res) => {
    const dropBeersQuery = 'DROP TABLE IF EXISTS beers';
    const dropBeersFoundQuery = 'DROP TABLE IF EXISTS beersfound';
    const dropUsersQuery = 'DROP TABLE IF EXISTS users'; // New query to drop Users table
  
    sql.query(dropBeersQuery, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error dropping beers table');
      }
  
      sql.query(dropBeersFoundQuery, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error dropping beersfound table');
        }
  
        sql.query(dropUsersQuery, (err, results) => { // New query execution to drop Users table
          if (err) {
            console.error(err);
            return res.status(500).send('Error dropping users table');
          }
  
          return res.status(200).send('Tables beers, beersfound and users dropped successfully, thanks for the use');
        });
      });
    });
  };


module.exports = {createNewUser, createSignUPTable,createBeersTable, insertData, findTheRightBeer, solution,dropTables,loginUser};

