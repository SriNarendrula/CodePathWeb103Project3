const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Ensure your Render external connection string is stored in your .env file as DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for safe Render connections
  }
});

// --- API ROUTES ---

// 1. Get all locations (For your main grid page)
app.get('/api/locations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations ORDER BY id ASC;');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching locations');
  }
});

// 2. Get a single location by its unique slug
app.get('/api/locations/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM locations WHERE slug = $1;', [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Location not found in the realm' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching location details');
  }
});

// 3. Get all events for a specific location ID
app.get('/api/locations/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM events WHERE location_id = $1 ORDER BY event_date ASC;', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching quests');
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🏰 Adventurer Guild backend running on port ${PORT}`);
});