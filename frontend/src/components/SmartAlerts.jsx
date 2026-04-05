import React, { useEffect, useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';

const SmartAlerts = ({ alerts }) => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(() => {
    // Whenever a new alert comes, add it to visible alerts and set a timeout to remove it
    if (alerts && alerts.length > 0) {
      const newAlerts = alerts.map((a, index) => ({ ...a, id: Date.now() + index }));
      setVisibleAlerts(prev => [...newAlerts, ...prev].slice(0, 5)); // keep last 5
      
      newAlerts.forEach(alert => {
        setTimeout(() => {
          setVisibleAlerts(prev => prev.filter(v => v.id !== alert.id));
        }, 5000);
      });
    }
  }, [alerts]);

  if (visibleAlerts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      maxWidth: '350px'
    }}>
      {visibleAlerts.map(alert => (
        <div key={alert.id} className="glass-panel alert-toast">
          {alert.type === 'OVERSPEED' ? 
            <AlertTriangle color="var(--danger-color)" /> : 
            <Info color="var(--primary-color)" />
          }
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: alert.type === 'OVERSPEED' ? 'var(--danger-color)' : 'white' }}>
              {alert.type}
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{alert.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmartAlerts;
