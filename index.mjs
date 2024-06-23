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

// Create a new pool instance
const pool = new Pool(credentials);

// Utility function to execute a query
const executeQuery = async (query) => {
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Creating a new Express application
const app = express();
const port = 9000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to test database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await executeQuery("SELECT * FROM source LIMIT 1");
    res.json(result);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle custom queries
app.post('/query', async (req, res) => {
  const { view, query } = req.body;

  if (!view || !query) {
    return res.status(400).send('Bad Request: Missing view or query parameter');
  }

  try {
    const result = await executeQuery(query);
    res.json(result);
  } catch (error) {
    res.status(500).send('Internal Server Error');
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

// Function to execute a startup query
const start = async () => {
  try {
    const result = await executeQuery("SELECT * FROM counter");
    console.log(result); // Print out only the actual data
  } catch (error) {
    console.error(error);
  }
};

start().catch(console.error);
