import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Destructure Pool from the default import
const { Pool } = pkg;
const PG_USER = "root"
const PG_PASSWORD = ""
const PG_DATABASE = "dev"
const PG_PORT = "80"
const PG_HOST = "risingwave-psql.dp-1-438.svc.cluster.local"
// Database credentials from environment variables
const credentials = {
  user: process.env.PG_USER || 'root',
  host: process.env.PG_HOST || 'risingwave-psql.dp-1-438.svc.cluster.local',
  database: process.env.PG_DATABASE || 'dev',
  password: process.env.PG_PASSWORD || '',
  port: process.env.PG_PORT || '80',
};

console.log(credentials)

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
