const {Pool} = require('pg');
require('dotenv').config();

//Create a PostgreSQL connection pool
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: String(process.env.PG_PASSWORD),
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
});

//Testing the connection
console.log('POSTGRES_USER:', process.env.PG_USER);
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log('Error connecting to postgreSQL', err);
    } else {
        console.log('Connected to postgreSQL database at: ', res.rows[0].now);
    }
});

module.exports = pool;
