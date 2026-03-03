import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NEIGHBOURHOODS } from '../data/neighbourhoods';

// Rough bounding box for Toronto area to prevent zooming way out.
const TORONTO_BOUNDS = [
  [43.55, -79.7],
  [43.9, -79.1],
];

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

function createUserIcon() {
  const size = 22;
  const box = 26;
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width:${box}px;
      height:${box}px;
      border-radius:50%;
      background:rgba(52, 152, 219,0.25);
      display:flex;
      align-items:center;
      justify-content:center;
    ">
      <div style="
        width:${size / 1.8}px;
        height:${size / 1.8}px;
        border-radius:50%;
        background:#3498db;
        box-shadow:0 0 0 2px #fff;
      "></div>
    </div>`,
    iconSize: [box, box],
    iconAnchor: [box / 2, box / 2],
  });
}

export default function Map({ onSelect }) {
  const [userPos, setUserPos] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('Geolocation error', err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 20000,
      }
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <div className="map-layer" style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={[43.668, -79.4]}
        zoom={12}
        minZoom={11}
        maxZoom={18}
        maxBounds={TORONTO_BOUNDS}
        maxBoundsViscosity={1.0}
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
        {userPos && (
          <Marker position={[userPos.lat, userPos.lng]} icon={createUserIcon()}>
            <Tooltip direction="top" offset={[0, -14]} className="lt-tip" permanent={false}>
              You are here
            </Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
