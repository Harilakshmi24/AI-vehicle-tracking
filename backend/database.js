const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database_v3.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database (v3).');
    
    // Create Tables
    db.run(`
      CREATE TABLE IF NOT EXISTS trips (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         distance REAL DEFAULT 0,
         max_speed REAL DEFAULT 0,
         fuel_used REAL DEFAULT 0,
         driving_score REAL DEFAULT 100,
         duration_seconds INTEGER DEFAULT 0,
         rules_violated INTEGER DEFAULT 0,
         time_saved_seconds INTEGER DEFAULT 0,
         status TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS coordinates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER,
        lat REAL,
        lng REAL,
        speed REAL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(trip_id) REFERENCES trips(id)
      )
    `);
  }
});

module.exports = db;
