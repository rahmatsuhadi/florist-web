import React from "react";
import { Smartphone } from "lucide-react";
import { OrderWithItems } from "@/services/admin/orderService";

export const OrderCustomerInfo = ({ transaction }: { transaction: OrderWithItems }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-6 h-full">
      <h3 className="font-serif text-lg font-semibold text-gray-900 border-b pb-3">Informasi Pelanggan</h3>
      <div className="space-y-4 pt-1">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-brand-light text-brand rounded-xl mt-0.5"><Smartphone size={20} /></div>
          <div>
            <h5 className="font-semibold text-gray-900 text-base">Identitas Pemesan</h5>
            <div className="text-sm text-gray-600 mt-2 font-sans space-y-2">
              <p><span className="font-semibold text-gray-800">Nama:</span> {transaction.customerName}</p>
              <p><span className="font-semibold text-gray-800">Kontak WA:</span> {transaction.customerPhone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
