// frontend/components/Map.tsx
"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { type LatLngExpression } from 'leaflet'
import defaultIcon from '@/components/mapIcon'

// This interface must match the one in your nearby/page.tsx
interface Incident {
  _id: string;
  category: string;
  address: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface MapProps {
    incidents: Incident[];
    center: [number, number]; // [latitude, longitude]
}

export default function Map({ incidents, center }: MapProps) {
  // Validate and normalize center
  const isNum = (v: any) => typeof v === 'number' && isFinite(v);
  const safeCenter: [number, number] = (Array.isArray(center) && isNum(center[0]) && isNum(center[1]))
    ? center
    : [28.5355, 77.3910];

  // Filter incidents with valid coordinates and map to [lat, lng]
  const markers = (incidents || []).filter((inc) => {
    const coords = inc?.location?.coordinates;
    return Array.isArray(coords) && coords.length === 2 && isNum(coords[0]) && isNum(coords[1]);
  }).map((incident) => ({
    ...incident,
    location: {
      coordinates: [incident.location.coordinates[1], incident.location.coordinates[0]]
    }
  }));

  const centerExpr: LatLngExpression = safeCenter as LatLngExpression;
  return (
    <MapContainer center={centerExpr} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '0 0 0.5rem 0.5rem' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((incident) => (
        <Marker
          key={incident._id}
          position={incident.location.coordinates as [number, number]}
          icon={defaultIcon}
        >
          <Popup>
            <b>{incident.category}</b><br/>{incident.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}