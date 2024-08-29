require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const executeQuery = async (query, params = []) => {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL database successfully.');
  } catch (error) {
    console.error('Failed to connect to PostgreSQL database:', error);
  }
};

if (require.main === module) {
  testConnection();
}

module.exports = {
  executeQuery,
  pool,
};
