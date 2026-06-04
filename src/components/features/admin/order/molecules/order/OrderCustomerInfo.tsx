import React from "react";
import { Smartphone } from "lucide-react";
import { OrderWithItems } from "@/services/admin/orderService";

export const OrderCustomerInfo = ({ transaction }: { transaction: OrderWithItems }) => {
  return (
    <div className="bg-brand-light/40 p-5 rounded-2xl border border-brand/10 space-y-3">
      <h4 className="font-semibold text-xs text-brand uppercase tracking-wider flex items-center gap-1.5">
        <Smartphone size={14} /> Identitas Pelanggan
      </h4>
      <div className="text-xs space-y-1.5 text-gray-600 font-sans">
        <p><strong>Nama:</strong> {transaction.customerName}</p>
        <p><strong>Kontak WA:</strong> {transaction.customerPhone}</p>
      </div>
    </div>
  );
};
