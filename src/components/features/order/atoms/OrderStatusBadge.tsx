import React from "react";

export const OrderStatusBadge = ({ status }: { status: string }) => {
  const configs: Record<string, { color: string; text: string }> = {
    "Menunggu Pembayaran": {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      text: "Menunggu Pembayaran",
    },
    "Sudah Dibayar": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      text: "Sudah Dibayar",
    },
    "Sedang Diproses": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      text: "Sedang Diproses",
    },
    "Sedang Dikirim": {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      text: "Sedang Dikirim",
    },
    "Siap Diambil": {
      color: "bg-teal-100 text-teal-800 border-teal-200",
      text: "Siap Diambil",
    },
    "Selesai": {
      color: "bg-green-100 text-green-800 border-green-200",
      text: "Selesai",
    },
    "Dibatalkan": {
      color: "bg-red-100 text-red-800 border-red-200",
      text: "Dibatalkan",
    },
  };
  const conf = configs[status] || configs["Menunggu Pembayaran"];
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${conf.color} font-sans`}
    >
      {conf.text}
    </span>
  );
};
