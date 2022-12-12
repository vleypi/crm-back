const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : ''
});
 
connection.connect();



const query = util.promisify(connection.query).bind(connection) 


module.exports = query