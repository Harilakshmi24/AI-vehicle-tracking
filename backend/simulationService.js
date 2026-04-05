const db = require('./database');

let activeSimulation = null;
let currentMetrics = null;
let previousSpeed = 0;
let tripStartTime = 0;

// Route roughly in a grid map logic
let currentLat = 13.0827;
let currentLng = 80.2707; // e.g., Chennai coord start

const startSimulation = (io, tripId) => {
  if (activeSimulation) clearInterval(activeSimulation);
  
  currentMetrics = {
    distance: 0,
    maxSpeed: 0,
    fuelUsed: 0,
    drivingScore: 100,
    rulesViolated: 0
  };

  tripStartTime = Date.now();
  previousSpeed = 0;

  activeSimulation = setInterval(() => {
    // Simulate slight movement
    currentLat += (Math.random() - 0.5) * 0.005;
    currentLng += (Math.random() - 0.5) * 0.005;
    
    // Simulate speed in km/h (between 20 and 100)
    const baseSpeed = 40 + (Math.random() - 0.5) * 30; // 25 to 55 normally
    const speedVariation = Math.random() > 0.8 ? 50 : 0; // sudden spikes
    let speed = baseSpeed + speedVariation;
    if (speed < 0) speed = 0;

    // Simulate Driving Behaviors
    const events = [];
    if (speed > 80) {
      events.push({ type: 'OVERSPEED', message: `Vehicle exceeded 80 km/h (${Math.round(speed)} km/h)` });
      currentMetrics.drivingScore -= 2;
      currentMetrics.rulesViolated += 1;
    }
    
    const speedDiff = speed - previousSpeed;
    if (speedDiff > 20) {
      events.push({ type: 'HARSH ACCELERATION', message: 'Sudden increase in speed detected' });
      currentMetrics.drivingScore -= 5;
      currentMetrics.rulesViolated += 1;
    } else if (speedDiff < -20) {
      events.push({ type: 'SUDDEN BRAKING', message: 'Harsh braking event detected' });
      currentMetrics.drivingScore -= 5;
      currentMetrics.rulesViolated += 1;
    }
    previousSpeed = speed;

    // Fatigue Alert (Simulating long driving if > 2 minutes for demo purposes, normally hours)
    const activeTimeMs = Date.now() - tripStartTime;
    if (activeTimeMs > 120000 && Math.random() > 0.95) { // after 2 mins, occasionally trigger
       events.push({ type: 'FATIGUE WARNING', message: 'Continuous driving detected. Consider taking a break.' });
       currentMetrics.rulesViolated += 1;
    }
    
    // Update max speed
    if (speed > currentMetrics.maxSpeed) {
      currentMetrics.maxSpeed = speed;
    }

    // Accumulate distance (realistic scaling factor x300 for 5-min increments per second)
    const iterationDistance = (speed / 3600) * 300; 
    currentMetrics.distance += iterationDistance;

    // AI Prediction Mock for fuel
    // Basically: fuel = distance * constant + speed penalty
    const efficiency = speed > 60 ? 12 : 15; // km per liter
    const iterationFuel = iterationDistance / efficiency;
    currentMetrics.fuelUsed += iterationFuel;

    // Time scaling: 1 iteration (1 real second) simulates 300 seconds (5 minutes) of driving
    currentMetrics.simulatedElapsedSeconds = (currentMetrics.simulatedElapsedSeconds || 0) + 300;
    
    // Assume AI routing saves roughly 15% of driving time vs standard traffic
    currentMetrics.timeSavedSeconds = Math.floor(currentMetrics.simulatedElapsedSeconds * 0.15);

    // Emit live stats
    const payload = {
      tripId,
      lat: currentLat,
      lng: currentLng,
      speed: Math.round(speed),
      events,
      stats: currentMetrics
    };
    
    io.emit('vehicle_update', payload);

    // Save coordinate to db (optional, throttle this in production)
    db.run('INSERT INTO coordinates (trip_id, lat, lng, speed) VALUES (?, ?, ?, ?)',
      [tripId, currentLat, currentLng, speed]);

  }, 1000); // Update every second for snappy UI Demo
};

const stopSimulation = () => {
  let duration = 0;
  if (tripStartTime) {
     duration = Math.floor((Date.now() - tripStartTime) / 1000);
  }
  
  if (activeSimulation) {
    clearInterval(activeSimulation);
    activeSimulation = null;
  }
  return { 
     ...currentMetrics, 
     durationSeconds: currentMetrics?.simulatedElapsedSeconds || 0,
     timeSaved: currentMetrics?.timeSavedSeconds || 0
  } || { distance: 0, maxSpeed: 0, fuelUsed: 0, drivingScore: 100, rulesViolated: 0, durationSeconds: 0, timeSaved: 0 };
};

module.exports = { startSimulation, stopSimulation };
