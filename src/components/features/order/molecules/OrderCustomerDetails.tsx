import React from "react";
import { MapPin, Package } from "lucide-react";
import { OrderWithItems } from "@/services/admin/orderService";

export const OrderCustomerDetails = ({ order }: { order: OrderWithItems }) => {
  return (
    <div className="mb-8">
      <h3 className="font-playfair text-lg text-[#2C302E] mb-3 flex items-center gap-2">
        {/* @ts-ignore */}
        {order.deliveryMethod === "pickup" ? (
          <><Package size={18} /> Metode Pengambilan</>
        ) : (
          <><MapPin size={18} /> Detail Pengiriman</>
        )}
      </h3>
      <div className="bg-[#FAFAF7] p-4 rounded-none border border-[#E8D9D2] font-sans text-sm text-[#5A635E]">
        <p className="font-semibold text-[#2C302E] text-base mb-1">{order.customerName}</p>
        <p className="mb-2">{order.customerPhone}</p>

        {/* @ts-ignore */}
        {order.deliveryMethod === "pickup" ? (
          <div className="mt-2 p-3 bg-[#FAFAF7] border border-[#E8D9D2] rounded-none text-[#2C302E]">
            <p className="font-medium text-brand">Ambil Sendiri (Pick Up)</p>
            {order.scheduledDate && order.scheduledTime && (
              <p className="text-sm mt-2">
                <span className="font-semibold">Jadwal Pengambilan:</span><br/>
                {new Date(order.scheduledDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} Pukul {order.scheduledTime}
              </p>
            )}
            <p className="text-xs mt-2 text-[#5A635E]">Silakan ambil pesanan Anda di toko fisik kami ketika status sudah "Siap Diambil".</p>
          </div>
        ) : (
          <>
            <p className="leading-relaxed">{order.customerAddress}</p>
            {order.scheduledDate && order.scheduledTime && (
              <div className="mt-2 p-3 bg-[#FAFAF7] border border-[#E8D9D2] rounded-none text-[#2C302E]">
                <p className="text-sm">
                  <span className="font-semibold">Jadwal Pengiriman:</span><br/>
                  {new Date(order.scheduledDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} Pukul {order.scheduledTime}
                </p>
              </div>
            )}
          </>
        )}

        {order.customerNotes && (
          <div className="mt-4 pt-4 border-t border-[#E8D9D2]">
            <p className="font-semibold text-[#2C302E] mb-1">Catatan Tambahan:</p>
            <p className="italic">"{order.customerNotes}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
