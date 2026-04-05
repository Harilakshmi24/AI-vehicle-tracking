import React, { useState } from 'react';
import { Compass, Info, Route } from 'lucide-react';

const RoutePlanner = () => {
  const [destination, setDestination] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!destination.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ destination })
      });
      const data = await res.json();
      setPrediction(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Route size={24} color="var(--secondary-color)"/> Route Optimization & Insights
      </h3>
      
      <form onSubmit={handlePredict} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Enter Destination City..." 
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            color: 'white',
            fontFamily: 'var(--font-main)',
            outline: 'none'
          }}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Analyzing...' : 'Get Insights'}
        </button>
      </form>

      {prediction && (
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Optimized Route</div>
                   <div style={{ fontWeight: '600' }}>{prediction.suggestedRoute}</div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>{prediction.distanceKm} km</div>
                </div>
                <div>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Est. Duration</div>
                   <div style={{ fontWeight: '600' }}>{Math.floor(prediction.durationMins / 60)}h {prediction.durationMins % 60}m</div>
                </div>
                <div>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Predicted Fuel Cost</div>
                   <div style={{ fontWeight: '600' }}>{prediction.estimatedFuelLiters} L ({prediction.estimatedFuelCost})</div>
                </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid var(--accent-color)', borderRadius: '0 8px 8px 0', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Compass size={18} color="var(--accent-color)" />
                <span><strong style={{ color: 'var(--accent-color)' }}>AI Suggestion:</strong> {prediction.bestTimeToTravel}</span>
            </div>
        </div>
      )}

    </div>
  );
};

export default RoutePlanner;
