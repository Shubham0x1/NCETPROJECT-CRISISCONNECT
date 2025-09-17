// frontend/components/Map.tsx
"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// This interface must match the one in your nearby/page.tsx
interface Incident {
  _id: string;
  category: string;
  address: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

// Fix for default Leaflet icon not appearing correctly in React
const defaultIcon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41]
});

interface MapProps {
    incidents: Incident[];
    center: [number, number]; // [latitude, longitude]
}

export default function Map({ incidents, center }: MapProps) {
  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '0 0 0.5rem 0.5rem' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {incidents.map((incident) => (
        <Marker
          key={incident._id}
          position={[
            incident.location.coordinates[1], // Latitude
            incident.location.coordinates[0]  // Longitude
          ]}
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