"use client";

import React, { useState } from "react";
import { MapPin, Calendar } from "lucide-react";
import dynamic from "next/dynamic";
import { OrderWithItems } from "@/services/admin/orderService";

const LocationPicker = dynamic(() => import("@/components/features/checkout/molecules/LocationPicker"), { ssr: false });

export const OrderShippingInfo = ({ transaction }: { transaction: OrderWithItems }) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-6">
      <h3 className="font-serif text-lg font-semibold text-gray-900 border-b pb-3">Pengiriman & Penjadwalan</h3>
      <div className="space-y-4 pt-1">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-brand-light text-brand rounded-lg mt-0.5"><MapPin size={16} /></div>
          <div>
            <h5 className="font-semibold text-gray-900 text-sm">
              {/* @ts-ignore */}
              {transaction.deliveryMethod === "pickup" ? "Metode Pengambilan" : "Alamat Pengiriman"}
            </h5>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed font-sans">
              {/* @ts-ignore */}
              {transaction.deliveryMethod === "pickup" ? "Pelanggan akan mengambil pesanan sendiri di toko (Pick Up)." : transaction.customerAddress}
            </p>
            
            {/* @ts-ignore */}
            {transaction.deliveryMethod !== "pickup" && transaction.customerLatitude && transaction.customerLongitude && (
              <div className="mt-3 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold rounded-lg transition-all"
                  >
                    <MapPin size={12} /> {showMap ? "Tutup Peta" : "Lihat Peta Tersemat"}
                  </button>
                  <a
                    // @ts-ignore
                    href={`https://www.google.com/maps?q=${transaction.customerLatitude},${transaction.customerLongitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 hover:bg-brand/20 text-brand text-[11px] font-bold rounded-lg transition-all"
                  >
                    <MapPin size={12} /> Buka di Google Maps
                  </a>
                </div>

                {showMap && (
                  <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden relative z-0">
                    <LocationPicker 
                      position={{ 
                        // @ts-ignore
                        lat: Number(transaction.customerLatitude), 
                        // @ts-ignore
                        lng: Number(transaction.customerLongitude) 
                      }} 
                      readOnly={true} 
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Jadwal Pengiriman/Pengambilan */}
        {/* @ts-ignore */}
        {(transaction.scheduledDate || transaction.scheduledTime) && (
          <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-0.5"><Calendar size={16} /></div>
            <div>
              <h5 className="font-semibold text-gray-900 text-sm">
                {/* @ts-ignore */}
                {transaction.deliveryMethod === "pickup" ? "Jadwal Pengambilan" : "Jadwal Pengiriman"}
              </h5>
              <p className="text-xs text-gray-600 mt-1 font-sans">
                <span className="font-semibold text-gray-800">Tanggal:</span> {/* @ts-ignore */} {transaction.scheduledDate || "-"}<br/>
                <span className="font-semibold text-gray-800">Jam:</span> {/* @ts-ignore */} {transaction.scheduledTime || "-"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
