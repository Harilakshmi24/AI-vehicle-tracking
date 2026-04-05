const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const db = require('./database');
const { startSimulation, stopSimulation } = require('./simulationService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// API Routes
app.get('/api/trips', (req, res) => {
  db.all('SELECT * FROM trips ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/trips', (req, res) => {
  db.run('INSERT INTO trips (status) VALUES (?)', ['active'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    const tripId = this.lastID;
    
    // Start simulation when a trip starts
    startSimulation(io, tripId);
    
    res.json({ id: tripId, status: 'active' });
  });
});

app.post('/api/trips/:id/stop', (req, res) => {
  const { id } = req.params;
  const metrics = stopSimulation();
  
  db.run(
    'UPDATE trips SET status = ?, distance = ?, max_speed = ?, fuel_used = ?, driving_score = ?, duration_seconds = ?, rules_violated = ?, time_saved_seconds = ? WHERE id = ?',
    ['completed', metrics.distance, metrics.maxSpeed, metrics.fuelUsed, metrics.drivingScore, metrics.durationSeconds, metrics.rulesViolated, metrics.timeSaved, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, metrics });
    }
  );
});

app.post('/api/route', (req, res) => {
  const { destination } = req.body;
  if (!destination) return res.status(400).json({ error: 'Destination is required' });
  
  // Mock Route Optimization and Predictive Insights Response
  // (Simulating Google Directions API Data)
  const simulatedDistance = Math.floor(Math.random() * 300) + 50; // 50 to 350 km
  const simulatedDurationMins = Math.floor(simulatedDistance * 1.2); // ~ 50 km/h avg
  
  // Fuel AI Prediction based on distance and assumed vehicle type
  const estimatedFuel = (simulatedDistance / 14).toFixed(1); // Assuming 14 km/L
  const fuelCost = (estimatedFuel * 102).toFixed(2); // Assuming ₹102 per Liter
  
  // Best time logic
  const currentHour = new Date().getHours();
  let bestTime = "Now is a good time";
  if (currentHour > 7 && currentHour < 10) bestTime = "Leave after 11:00 AM to avoid rush hour";
  if (currentHour > 16 && currentHour < 20) bestTime = "Leave after 8:00 PM for least traffic";

  res.json({
    destination,
    distanceKm: simulatedDistance,
    durationMins: simulatedDurationMins,
    estimatedFuelLiters: estimatedFuel,
    estimatedFuelCost: '₹' + fuelCost,
    bestTimeToTravel: bestTime,
    suggestedRoute: "Fastest via NH48",
  });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
