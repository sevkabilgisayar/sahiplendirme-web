'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';

// Fix missing marker icons in Next.js + Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

interface MapProps {
  center: [number, number];
  zoom?: number;
  popupText?: string;
  className?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
}

function RecenterAutomatically({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function ClickHandler({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function Map({ center, zoom = 13, popupText, className = "w-full h-full", onLocationSelect }: MapProps) {
  useEffect(() => {
    // Optional client-side only initialization logic
  }, []);

  return (
    <div className={`overflow-hidden rounded-2xl border border-[var(--border)] relative z-0 ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={icon}>
          {popupText && (
            <Popup>
              <div className="font-sans text-sm font-semibold">{popupText}</div>
            </Popup>
          )}
        </Marker>
        <RecenterAutomatically center={center} />
        {onLocationSelect && <ClickHandler onLocationSelect={onLocationSelect} />}
      </MapContainer>
    </div>
  );
}
