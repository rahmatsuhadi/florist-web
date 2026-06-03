import React from 'react';

export const PaymentStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'success':
    case 'settlement':
    case 'capture':
      return <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">Berhasil</span>;
    case 'pending':
      return <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-amber-50 border border-amber-200 text-amber-700">Tertunda</span>;
    default:
      return <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-red-50 border border-red-200 text-red-700">Gagal / Batal</span>;
  }
};
