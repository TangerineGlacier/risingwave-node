import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Destructure Pool from the default import
const { Pool } = pkg;

// Database credentials from environment variables
const credentials = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
};

// Creating a new Express application
const app = express();
const port = 9000;

// Route to test database connection
app.get('/test-db', async (req, res) => {
  const pool = new Pool(credentials);
  try {
    const result = await pool.query("select * from source limit 1");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    await pool.end();
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
