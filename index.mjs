import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Destructure Pool from the default import
const { Pool } = pkg;
const PG_USER = "root";
const PG_PASSWORD = "";
const PG_DATABASE = "dev";
const PG_PORT = "80";
const PG_HOST = "risingwave-psql.dp-1-438.svc.cluster.local";

// Database credentials from environment variables
const credentials = {
  user: process.env.PG_USER || PG_USER,
  host: process.env.PG_HOST || PG_HOST,
  database: process.env.PG_DATABASE || PG_DATABASE,
  password: process.env.PG_PASSWORD || PG_PASSWORD,
  port: process.env.PG_PORT || PG_PORT,
};

console.log(credentials);

// Creating a new Express application
const app = express();
const port = 9000;
app.use(express.json());

// Middleware to check for the correct API key
const apiKey = 'Z3kB7tR1mW9pQ6dL';

const authorize = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader === `Apikey ${apiKey}`) {
    next(); // Authorized
  } else {
    res.status(401).send('Unauthorized');
  }
};

// Apply the authorize middleware to all routes that need protection
app.use(['/test-db', '/query', '/create'], authorize);

// Route to test database connection
app.get('/test-db', async (req, res) => {
  const pool = new Pool(credentials);
  try {
    const result = await pool.query("SELECT * FROM policy LIMIT 1");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    await pool.end();
  }
});

// Query a materialized view
app.post('/query', async (req, res) => {
  const pool = new Pool(credentials);
  const query = req.body.query;
  console.log(query);
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    await pool.end();
  }
});

// Create a materialized view
app.post('/create', async (req, res) => {
  const pool = new Pool(credentials);
  const query = req.body.query;
  console.log(query);
  try {
    const result = await pool.query(query);
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
