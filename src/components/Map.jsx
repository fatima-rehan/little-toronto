import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NEIGHBOURHOODS } from '../data/neighbourhoods';

function MapContent() {
  const map = useMap();
  const zoomRef = useRef(null);
  useEffect(() => {
    if (zoomRef.current) return;
    const ctrl = L.control.zoom({ position: 'bottomright' });
    zoomRef.current = ctrl;
    ctrl.addTo(map);
    return () => {
      if (zoomRef.current) {
        map.removeControl(zoomRef.current);
        zoomRef.current = null;
      }
    };
  }, [map]);
  return null;
}

function createFlagIcon(flag, isKensington = false) {
  const size = isKensington ? 22 : 30;
  const box = isKensington ? 26 : 34;
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="font-size:${size}px;cursor:pointer;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.4));transition:transform 0.2s;line-height:1;">${flag}</div>`,
    iconSize: [box, box],
    iconAnchor: [box / 2, box / 2],
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
            icon={createFlagIcon(n.flag, n.id === 'kensington')}
            eventHandlers={{
              click: () => onSelect(n.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -14]} className="lt-tip" permanent={false}>
              {n.id === 'kensington' ? 'Kensington Market' : n.name}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
