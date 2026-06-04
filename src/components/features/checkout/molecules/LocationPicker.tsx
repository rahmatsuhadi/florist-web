"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation } from "lucide-react";

// Create custom marker icon matching the theme
const customMarkerIcon = L.divIcon({
  className: "custom-map-marker",
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#829E8D" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 32px; height: 32px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface LocationPickerProps {
  position: { lat: number; lng: number } | null;
  setPosition?: (pos: { lat: number; lng: number } | null) => void;
  readOnly?: boolean;
}

function LocationMarker({ position, setPosition, readOnly }: LocationPickerProps) {
  const map = useMapEvents({
    click(e) {
      if (!readOnly && setPosition) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null && !readOnly && setPosition) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [setPosition]
  );

  return position === null ? null : (
    <Marker
      draggable={!readOnly}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={customMarkerIcon}
    />
  );
}

// Component to fly to the new location when the prop changes (e.g., from 'Current Location' button)
function MapUpdater({ position }: { position: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 16);
  }, [position, map]);
  return null;
}

export default function LocationPicker({ 
  position, 
  setPosition, 
  error, 
  readOnly,
  label,
  helperText,
  className = "",
  height = "h-64"
}: LocationPickerProps & { error?: string; label?: string; helperText?: string; className?: string; height?: string }) {
  const [loadingLoc, setLoadingLoc] = useState(false);
  
  // Default to Yogyakarta center if no position
  const defaultCenter = { lat: -7.7956, lng: 110.3695 }; 

  const handleCurrentLocation = () => {
    setLoadingLoc(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (setPosition) setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoadingLoc(false);
        },
        (err) => {
          console.error("Error getting location:", err);
          alert("Gagal mendapatkan lokasi saat ini. Pastikan izin akses lokasi diaktifkan.");
          setLoadingLoc(false);
        }
      );
    } else {
      alert("Browser Anda tidak mendukung deteksi lokasi otomatis.");
      setLoadingLoc(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header section with optional label and location button */}
      {(label || !readOnly) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="block font-sans text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
          {!readOnly && (
            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={loadingLoc}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#829E8D] hover:text-[#5A635E] transition-colors ml-auto"
            >
              <Navigation size={14} className={loadingLoc ? "animate-pulse" : ""} />
              {loadingLoc ? "Mencari..." : "Gunakan Lokasi Saat Ini"}
            </button>
          )}
        </div>
      )}

      {/* Map Container */}
      <div className={`${height} w-full rounded-none overflow-hidden border relative z-0 ${error ? 'border-red-400 focus-within:ring-1 focus-within:ring-red-400' : 'border-[#E8D9D2] focus-within:border-[#829E8D] focus-within:ring-1 focus-within:ring-[#829E8D]'} transition-all`}>
        <MapContainer
          center={position || defaultCenter}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} readOnly={readOnly} />
          {position && <MapUpdater position={position} />}
        </MapContainer>
      </div>
      
      {/* Footer / Helper Text */}
      {helperText && !readOnly && (
        <p className="text-[11px] text-gray-500 mt-1">
          {helperText}
        </p>
      )}
      
      {/* Error Message */}
      {error && (
        <p className="block font-sans text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
