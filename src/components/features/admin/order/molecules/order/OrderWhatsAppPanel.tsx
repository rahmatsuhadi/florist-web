import React from "react";
import { Send } from "lucide-react";
import { OrderWithItems } from "@/services/admin/orderService";
import { generateWhatsAppMessage } from "@/utils/orderUtils";

export const OrderWhatsAppPanel = ({ transaction, status }: { transaction: OrderWithItems, status: string }) => {
  const cleanPhone = transaction.customerPhone.replace(/[^0-9]/g, "");
  
  return (
    <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-5">
      <div className="border-b pb-3">
        <h3 className="font-serif text-lg font-semibold text-gray-900">Alur Tanggapan WhatsApp</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-semibold text-sm text-gray-900">Kirim Update Status via WhatsApp</h4>
          <p className="text-xs text-gray-400">Kirim teks konfirmasi transaksi otomatis dari sistem ke chat pembeli secara langsung.</p>
        </div>
        <a
          href={`https://wa.me/${cleanPhone}?text=${generateWhatsAppMessage(transaction, status)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0 w-full sm:w-auto justify-center"
        >
          <Send size={14} /> Hubungi Pembeli
        </a>
      </div>
    </div>
  );
};
