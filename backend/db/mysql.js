const mysql = require('mysql2');
require('dotenv').config();

// creating a MYSQL connection

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

//Testing the connection
console.log('MYSQL_USER:', process.env.MYSQL_USER);
async function testConnection(){
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database');
        connection.release();
    } catch (error) {
        console.error('Error connecting to MySQL', error);
    }
}

testConnection();

module.exports = pool;