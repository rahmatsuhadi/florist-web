"use client";

import L from "leaflet";
import React, { useEffect, useState, useRef, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents, useMap } from "react-leaflet";
import { MapPin, LocateFixed } from "lucide-react";
import { toast } from "sonner";

// Custom Brand Marker Icon using Lucide MapPin style
const customMarkerHtml = `
  <div style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));">
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#4A5D4E" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3" fill="white"></circle>
    </svg>
  </div>
`;

const CustomBrandIcon = L.divIcon({
  html: customMarkerHtml,
  className: "custom-leaflet-marker",
  iconSize: [36, 36],
  iconAnchor: [18, 36], // Point anchor to bottom center
  popupAnchor: [0, -36]
});

L.Marker.prototype.options.icon = CustomBrandIcon;

interface StorefrontMapPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

// Map event listener for clicks
function MapClickEvents({ setPosition }: { setPosition: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

// Controller to pan map
function MapController({ position }: { position: L.LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);
  return null;
}

const StorefrontMapPicker: React.FC<StorefrontMapPickerProps> = ({ latitude, longitude, onChange }) => {
  const [position, setPosition] = useState<L.LatLng>(new L.LatLng(latitude, longitude));
  const markerRef = useRef<L.Marker>(null);

  // Sync prop changes (if user types in input manually)
  useEffect(() => {
    setPosition(new L.LatLng(latitude, longitude));
  }, [latitude, longitude]);

  // Sync internal state changes to parent
  useEffect(() => {
    onChange(position.lat, position.lng);
  }, [position]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  const getCurrentLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      toast.error("Geolokasi tidak didukung oleh browser Anda.");
      return;
    }

    toast.info("Mengambil lokasi Anda...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
        setPosition(newPos);
        toast.success("Lokasi berhasil didapatkan!");
      },
      (err) => {
        console.error(err);
        toast.error("Gagal mendapatkan lokasi Anda. Pastikan izin lokasi diaktifkan.");
      }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <MapPin size={16} className="text-brand" />
          Pilih Lokasi di Peta
        </label>
      </div>

      <div className="w-full h-[350px] rounded-2xl overflow-hidden border border-brand/20 shadow-inner z-0 relative">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <MapController position={position} />
          <MapClickEvents setPosition={setPosition} />

          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
          >
          </Marker>
        </MapContainer>

        {/* Overlay Current Location Button */}
        <button 
          onClick={getCurrentLocation}
          title="Gunakan Lokasi Saat Ini"
          type="button"
          className="absolute top-4 right-4 z-[400] bg-white p-2.5 rounded-xl shadow-lg border border-brand/10 text-brand hover:text-white hover:bg-brand transition-all flex items-center justify-center group"
        >
          <LocateFixed size={20} className="transition-transform group-hover:scale-110" />
        </button>

        <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-brand/10 shadow-lg pointer-events-none">
          <p className="text-[10px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">Instruksi</p>
          <p className="text-xs text-gray-700">Geser pin atau klik pada peta untuk mengubah lokasi.</p>
        </div>
      </div>
    </div>
  );
};

export default StorefrontMapPicker;
