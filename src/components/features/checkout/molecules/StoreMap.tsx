"use client";

import L from "leaflet";
import type React from "react";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useAppContext } from "@/store/AppContext";

// Fix Leaflet default marker icon paths in next.js/react-leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface StoreMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
}

export const StoreMap: React.FC<StoreMapProps> = ({
  latitude,
  longitude,
  zoom = 16,
}) => {
  const { shopInfo } = useAppContext();
  const shopName = shopInfo?.name;
  const shopAddress = shopInfo?.address;
  const defaultLat = shopInfo?.latitude;
  const defaultLng = shopInfo?.longitude;
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-[#FAFAF7] text-sm font-sans text-[#5A635E]">
        Memuat Peta...
      </div>
    );
  }

  const finalLat = latitude ?? Number(defaultLat) ?? -7.9854932;
  const finalLng = longitude ?? Number(defaultLng) ?? 110.2284877;
  
  const position: [number, number] = [finalLat, finalLng];

  return (
    <div className="w-full h-full min-h-[300px] border border-[#E8D9D2] relative z-0">
      <MapContainer
        key={`${finalLat}-${finalLng}`}
        center={position}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="p-1 text-center font-sans">
              <strong className="font-playfair text-[#2C302E] block mb-1">
                {shopName || "L'Fleur Mattz"}
              </strong>
              <p className="text-xs text-[#5A635E] leading-normal m-0">
                {shopAddress}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default StoreMap;
