"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation } from "lucide-react";

// Fix missing marker icon issue in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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

export default function LocationPicker({ position, setPosition, error, readOnly }: LocationPickerProps & { error?: string }) {
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
    <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between">
        <label className="block font-sans text-sm text-[#5A635E]">
          {readOnly ? "Titik Koordinat Peta" : "Titik Koordinat Peta"}
        </label>
        {!readOnly && (
          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={loadingLoc}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#829E8D] hover:text-[#5A635E] transition-colors"
          >
            <Navigation size={14} className={loadingLoc ? "animate-pulse" : ""} />
            {loadingLoc ? "Mencari..." : "Gunakan Lokasi Saat Ini"}
          </button>
        )}
      </div>

      <div className={`h-48 w-full rounded-sm overflow-hidden border relative z-0 ${error ? 'border-red-400' : 'border-[#E8D9D2]'}`}>
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
      {!readOnly && (
        <p className="text-[10px] text-[#5A635E]/70 font-sans italic mt-1 leading-tight">
          *Klik peta atau geser penanda (marker) untuk menentukan titik akurat pengiriman bunga Anda.
        </p>
      )}
    </div>
  );
}
