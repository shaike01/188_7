const SQL = require('mysql2');
const config = require('./DB.config');

const connection = SQL.createConnection({
    host: config.HOST,
    database: config.DB,
    password: config.PASSWORD,
    user: config.USER
});

connection.connect(error=>{
    if (error) throw error;
    console.log("CONNECTED TO DB");
});
    
module.exports = connection;