import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import LiveMap from './components/LiveMap';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SmartAlerts from './components/SmartAlerts';
import RoutePlanner from './components/RoutePlanner';
import Profile from './components/Profile';
import Login from './components/Login';
import { Play, Square, Map, LayoutDashboard, Route as RouteIcon, LogOut, Settings, Sun, Moon } from 'lucide-react';
import './index.css';

const socket = io('http://localhost:5000');

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('map'); // 'map', 'dashboard', 'route', 'profile'
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);
  
  const [tripActive, setTripActive] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [path, setPath] = useState([]);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [currentAlerts, setCurrentAlerts] = useState([]);
  
  const [stats, setStats] = useState({
    distance: 0,
    maxSpeed: 0,
    fuelUsed: 0,
    drivingScore: 100
  });

  useEffect(() => {
    socket.on('vehicle_update', (data) => {
      const newPos = { lat: data.lat, lng: data.lng };
      setCurrentPosition(newPos);
      setPath(prev => [...prev, newPos]);
      
      const timeLabel = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' });
      setSpeedHistory(prev => {
        const updated = [...prev, { time: timeLabel, speed: data.speed }];
        if (updated.length > 20) updated.shift(); 
        return updated;
      });

      setStats(data.stats);

      if (data.events && data.events.length > 0) {
        setCurrentAlerts(data.events);
      }
    });

    return () => {
      socket.off('vehicle_update');
    };
  }, []);

  const handleStartTrip = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/trips', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'active') {
        setTripActive(true);
        setPath([]);
        setSpeedHistory([]);
        setStats({ distance: 0, maxSpeed: 0, fuelUsed: 0, drivingScore: 100 });
        setActiveTab('map'); // Auto switch to map to see movement
      }
    } catch (e) {
      console.error(e);
      alert('Failed to start trip. Ensure backend is running.');
    }
  };

  const handleStopTrip = async () => {
    try {
      const getRes = await fetch('http://localhost:5000/api/trips');
      const trips = await getRes.json();
      if (trips.length > 0) {
        const id = trips[0].id;
        await fetch(`http://localhost:5000/api/trips/${id}/stop`, { method: 'POST' });
        setTripActive(false);
        setActiveTab('dashboard'); // Auto switch to dashboard to view final stats
      }
    } catch(e) {
      console.error(e);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="layout-container">
      
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2 style={{ background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
            Fleet Command
          </h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>AI Vehicle Tracking</span>
        </div>

        <div className="sidebar-nav">
          <div 
             className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
             onClick={() => setActiveTab('map')}
          >
            <Map size={18} /> Live Tracking
          </div>
          
          <div 
             className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
             onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} /> Analytics Console
          </div>
          
          <div 
             className={`nav-item ${activeTab === 'route' ? 'active' : ''}`}
             onClick={() => setActiveTab('route')}
          >
            <RouteIcon size={18} /> Route Planner
          </div>
          
          <div 
             className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
             onClick={() => setActiveTab('profile')}
          >
            <Settings size={18} /> Driver Settings
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div 
             className="nav-item" 
             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} 
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </div>

          <div 
             className="nav-item" 
             style={{ color: 'var(--danger-color)' }}
             onClick={() => setIsAuthenticated(false)}
          >
            <LogOut size={18} /> Sign Out
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <SmartAlerts alerts={currentAlerts} />

        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ marginBottom: '0.25rem' }}>
              {activeTab === 'map' && 'Live GPS Tracking'}
              {activeTab === 'dashboard' && 'Fleet Analytics Dashboard'}
              {activeTab === 'route' && 'AI Route Optimization'}
              {activeTab === 'profile' && 'Configuration Console'}
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {!tripActive ? (
              <button className="btn" onClick={handleStartTrip}>
                <Play size={18} /> Start Trip
              </button>
            ) : (
              <button className="btn danger animate-pulse" onClick={handleStopTrip}>
                <Square size={18} /> Stop Trip
              </button>
            )}
          </div>
        </header>

        <div>
          <div style={{ display: activeTab === 'map' ? 'block' : 'none' }}>
             <LiveMap currentPosition={currentPosition} path={path} />
          </div>

          <div style={{ display: activeTab === 'dashboard' ? 'block' : 'none' }}>
             <AnalyticsDashboard stats={stats} speedHistory={speedHistory} />
          </div>

          <div style={{ display: activeTab === 'route' ? 'block' : 'none' }}>
             <RoutePlanner />
          </div>
          
          <div style={{ display: activeTab === 'profile' ? 'block' : 'none' }}>
             <Profile />
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;
