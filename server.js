const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Allow your React frontend to communicate with this server
app.use(cors());
app.use(express.json());

// Set up the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Vital for Render connections
  }
});

// --- API ENDPOINTS ---

// Get all locations
app.get('/api/locations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations ORDER BY id ASC;');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch regions.' });
  }
});

// Get a single location details using its slug
app.get('/api/locations/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM locations WHERE slug = $1;', [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Region undiscovered on this map.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch region details.' });
  }
});

// Get all quests/events for a specific location ID
app.get('/api/locations/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM events WHERE location_id = $1 ORDER BY event_date ASC;', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch active quests.' });
  }
});

app.listen(PORT, () => {
  console.log(`🏰 Guild Backend listening on port ${PORT}`);
});