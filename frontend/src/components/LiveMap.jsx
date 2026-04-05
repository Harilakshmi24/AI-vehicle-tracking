import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix typical leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
};

const LiveMap = ({ currentPosition, path }) => {
  // Center on India
  const defaultCenter = [20.5937, 78.9629];
  const center = currentPosition ? [currentPosition.lat, currentPosition.lng] : defaultCenter;

  return (
    <div className="glass-panel" style={{ height: '600px', width: '100%', padding: '0.5rem' }}>
      <MapContainer 
        center={center} 
        zoom={currentPosition ? 15 : 5} 
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {currentPosition && (
          <Marker position={[currentPosition.lat, currentPosition.lng]} />
        )}
        {path && path.length > 0 && (
          <Polyline positions={path.map(p => [p.lat, p.lng])} color="#3b82f6" weight={4} />
        )}
        <MapUpdater center={center} />
      </MapContainer>
    </div>
  );
};

export default LiveMap;
