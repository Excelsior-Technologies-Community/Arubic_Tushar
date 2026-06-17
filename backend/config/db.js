const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         
  password: '@Logitech24',        
  database: 'arubic_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
