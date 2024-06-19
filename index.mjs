import express from 'express';
import pkg from 'pg';

// Destructure Pool from the default import
const { Pool } = pkg;

// Database credentials
const credentials = {
  user: 'root',
  host: 'risingwave.nanoheal.work',
  database: 'dev',
  password: '',
  port: 4567,
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
