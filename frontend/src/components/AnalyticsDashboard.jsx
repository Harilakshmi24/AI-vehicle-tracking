import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Droplets, Target, ShieldAlert, Clock, AlertOctagon } from 'lucide-react';

const AnalyticsDashboard = ({ stats, speedHistory }) => {
  const [pastTrips, setPastTrips] = useState([]);

  const fetchTrips = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/trips');
      const data = await res.json();
      setPastTrips(data.filter(t => t.status === 'completed'));
    } catch (e) {
      console.error('Failed to fetch trips', e);
    }
  };

  useEffect(() => {
    fetchTrips();
    // Poll every few seconds to auto-update when a new trip stops
    const interval = setInterval(fetchTrips, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="glass-panel" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity size={24} color="var(--primary-color)"/> Real-Time Analytics
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="glass-panel metric-card">
          <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
             Distance
          </div>
          <div className="metric-value">{stats.distance.toFixed(2)} <span style={{fontSize:'1rem'}}>km</span></div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
             <Target size={16}/> Max Speed
          </div>
          <div className="metric-value">{Math.round(stats.maxSpeed)} <span style={{fontSize:'1rem'}}>km/h</span></div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
             <Droplets size={16} color="var(--accent-color)"/> Est. Fuel Used
          </div>
          <div className="metric-value">{stats.fuelUsed.toFixed(2)} <span style={{fontSize:'1rem'}}>L</span></div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
             <ShieldAlert size={16} color={stats.drivingScore < 80 ? 'var(--danger-color)' : 'var(--accent-color)'}/> Safety Score
          </div>
          <div className="metric-value" style={{ color: stats.drivingScore < 80 ? 'var(--danger-color)' : 'inherit' }}>
            {Math.max(0, stats.drivingScore)} <span style={{fontSize:'1rem'}}>/ 100</span>
          </div>
        </div>

      </div>

      <div style={{ height: '300px', width: '100%', marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Speed Profile (km/h)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={speedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-muted)" tick={{fontSize: 12}} />
            <YAxis stroke="var(--text-muted)" tick={{fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-main)' }}
            />
            <Area type="monotone" dataKey="speed" stroke="var(--primary-color)" fillOpacity={1} fill="url(#colorSpeed)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '3rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
        <Clock size={24} color="var(--secondary-color)"/> Past Trips History
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pastTrips.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No completed trips recorded yet. Use the Start Trip button!</div>
        ) : (
          pastTrips.map(trip => (
            <div key={trip.id} className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
              <div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TRIP ID #{trip.id}</div>
                 <div style={{ fontWeight: '600' }}>{new Date(trip.start_time).toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TIME TAKEN</div>
                 <div style={{ fontWeight: '600' }}>{Math.floor(trip.duration_seconds / 60)}m {trip.duration_seconds % 60}s</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MAX SPEED</div>
                 <div style={{ fontWeight: '600', color: trip.max_speed > 80 ? 'var(--danger-color)' : 'inherit' }}>{Math.round(trip.max_speed)} km/h</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TIME SAVED</div>
                 <div style={{ fontWeight: '600', color: 'var(--accent-color)' }}>{Math.floor((trip.time_saved_seconds || 0) / 60)}m {(trip.time_saved_seconds || 0) % 60}s</div>
              </div>
              <div style={{ flex: 1, minWidth: '150px', textAlign: 'right' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RULES VIOLATED</div>
                 <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem', color: trip.rules_violated > 0 ? 'var(--danger-color)' : 'var(--accent-color)' }}>
                    {trip.rules_violated > 0 ? <AlertOctagon size={16} /> : null}
                    {trip.rules_violated} Events
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AnalyticsDashboard;
