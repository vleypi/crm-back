const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : process.env.PASSWORD,
  database : process.env.DATABASE
});
 
connection.connect();



const query = util.promisify(connection.query).bind(connection) 


module.exports = query