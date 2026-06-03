"use client";

import React from "react";
import { CustomerInfo } from "@/store/AppContext";

interface Props {
  customerInfo: CustomerInfo;
}

export const CheckoutCustomerInfo: React.FC<Props> = ({ customerInfo }) => {
  return (
    <div className="bg-white p-6 rounded-none shadow-sm border border-[#E8D9D2]">
      <h2 className="font-playfair text-xl text-[#2C302E] mb-4">Informasi Pemesan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Nama Lengkap</p>
          <p className="font-medium text-gray-900">{customerInfo.name || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Nomor WhatsApp</p>
          <p className="font-medium text-gray-900">{customerInfo.phone || "-"}</p>
        </div>
      </div>
    </div>
  );
};
