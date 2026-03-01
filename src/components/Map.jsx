import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NEIGHBOURHOODS } from '../data/neighbourhoods';

function MapContent() {
  const map = useMap();
  useEffect(() => {
    L.control.zoom({ position: 'bottomright' }).addTo(map);
  }, [map]);
  return null;
}

function createFlagIcon(flag) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="font-size:30px;cursor:pointer;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.4));transition:transform 0.2s;line-height:1;">${flag}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

export default function Map({ onSelect }) {
  return (
    <div className="map-layer" style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={[43.668, -79.4]}
        zoom={12}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MapContent onSelect={onSelect} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />
        {NEIGHBOURHOODS.map((n) => (
          <Marker
            key={n.id}
            position={[n.lat, n.lng]}
            icon={createFlagIcon(n.flag)}
            eventHandlers={{
              click: () => onSelect(n.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -14]} className="lt-tip" permanent={false}>
              {n.name}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
