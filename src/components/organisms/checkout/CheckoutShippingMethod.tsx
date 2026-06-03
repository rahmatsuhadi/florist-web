"use client";

import React from "react";
import { Truck, Store } from "lucide-react";

interface Props {
  deliveryMethod: "delivery" | "pickup";
  setDeliveryMethod: (method: "delivery" | "pickup") => void;
}

export const CheckoutShippingMethod: React.FC<Props> = ({ deliveryMethod, setDeliveryMethod }) => {
  return (
    <div className="bg-white p-6 rounded-none shadow-sm border border-[#E8D9D2]">
      <h2 className="font-playfair text-xl text-[#2C302E] mb-4">Metode Pengiriman</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setDeliveryMethod("delivery")}
          className={`p-4 rounded-none border flex items-start gap-4 transition-all text-left ${
            deliveryMethod === "delivery" 
              ? "border-[#829E8D] bg-[#829E8D]/5 ring-1 ring-[#829E8D]" 
              : "border-[#E8D9D2] hover:border-[#829E8D]/50 bg-white"
          }`}
        >
          <div className={`p-2 rounded-none ${deliveryMethod === "delivery" ? "bg-[#829E8D] text-white" : "bg-gray-100 text-gray-500"}`}>
            <Truck size={20} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Kirim ke Alamat</h3>
            <p className="text-sm text-gray-500">Kurir akan mengirimkan pesanan ke alamat Anda.</p>
          </div>
        </button>
        <button
          onClick={() => setDeliveryMethod("pickup")}
          className={`p-4 rounded-none border flex items-start gap-4 transition-all text-left ${
            deliveryMethod === "pickup" 
              ? "border-[#829E8D] bg-[#829E8D]/5 ring-1 ring-[#829E8D]" 
              : "border-[#E8D9D2] hover:border-[#829E8D]/50 bg-white"
          }`}
        >
          <div className={`p-2 rounded-none ${deliveryMethod === "pickup" ? "bg-[#829E8D] text-white" : "bg-gray-100 text-gray-500"}`}>
            <Store size={20} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Ambil Sendiri</h3>
            <p className="text-sm text-gray-500">Ambil pesanan langsung di toko kami.</p>
          </div>
        </button>
      </div>
    </div>
  );
};
