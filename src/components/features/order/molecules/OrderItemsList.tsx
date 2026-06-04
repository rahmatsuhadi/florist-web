import React from "react";
import { Package } from "lucide-react";
import { OrderWithItems } from "@/services/admin/orderService";
import { formatIdr } from "@/utils/format";
import { VariantDetail } from "@/store/AppContext";

export const OrderItemsList = ({ order }: { order: OrderWithItems }) => {
  return (
    <div>
      <h3 className="font-playfair text-lg text-[#2C302E] mb-4 flex items-center gap-2">
        <Package size={18} /> Daftar Produk
      </h3>
      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 border-b border-[#E8D9D2] pb-4 last:border-0">
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden rounded-none">
              {item.productImage ? (
                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#829E8D] font-playfair font-bold text-xl">{item.productName.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-playfair text-[#2C302E]">{item.productName}</h4>
              {(item.variantDetails as VariantDetail[] | null)?.length ? (
                <p className="font-sans text-xs text-[#829E8D] mt-1">
                  {(item.variantDetails as VariantDetail[]).map(v => v.name).join(", ")}
                </p>
              ) : null}
              {item.notes && (
                <p className="font-sans text-[11px] text-gray-500 italic mt-1.5 p-2 bg-gray-50/80 rounded-none border border-gray-100">
                  Catatan: {item.notes}
                </p>
              )}
              <p className="font-sans text-sm text-[#5A635E] mt-1.5">
                {item.quantity} x {formatIdr(Number(item.productPrice))}
              </p>
            </div>
            <div className="font-sans font-medium text-[#2C302E]">
              {formatIdr(Number(item.productPrice) * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#E8D9D2] pt-4 mt-4 flex justify-between items-center text-xl font-playfair text-[#2C302E]">
        <span>Total Pesanan</span>
        <span className="text-[#829E8D]">{formatIdr(Number(order.totalAmount))}</span>
      </div>
    </div>
  );
};
