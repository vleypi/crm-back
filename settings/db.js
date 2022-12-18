const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'crm'
});
 
connection.connect();



const query = util.promisify(connection.query).bind(connection) 


module.exports = query