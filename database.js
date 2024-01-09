require('dotenv').config();
const { DATABASE_URL } = process.env;
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: DATABASE_URL + '?sslmode=require',
});

pool.connect((err) => {
  if (err) throw err;
  console.log('Connect to PostgreSQL Succesfully!');
});

module.exports = pool;
