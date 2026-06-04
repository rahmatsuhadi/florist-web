import React from "react";
import { Sparkles, Check } from "lucide-react";
import { formatIdr } from "@/utils/format";
import { OrderWithItems } from "@/services/admin/orderService";
import { VariantDetail } from "@/store/AppContext";

export const OrderProductList = ({ transaction }: { transaction: OrderWithItems }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-serif text-lg font-semibold text-gray-900">Detail Produk & Kustomisasi</h3>
        <span className="text-xs text-gray-400 font-medium">
          Dipesan {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
          })}
        </span>
      </div>

      <div className="space-y-4">
        {transaction.items.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-start bg-[#FDFBF7]/60 p-4 rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
              {item.productImage ? (
                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
              ) : (
                <Sparkles size={24} className="text-brand" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-[10px] bg-brand/15 text-brand px-2 py-0.5 rounded-full font-bold uppercase">{item.productCategory || "Umum"}</span>
              <h4 className="font-serif font-bold text-lg text-gray-950 mt-1">{item.productName} <span className="text-sm font-medium text-gray-500">(x{item.quantity})</span></h4>

              {item.variantDetails && (item.variantDetails as VariantDetail[]).length > 0 ? (
                <div className="pt-2 space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Opsi Variasi:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(item.variantDetails as VariantDetail[]).map((v, i) => (
                      <span key={i} className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-lg font-medium shadow-sm flex items-center gap-1">
                        <Check size={12} className="text-brand" /> {v.groupName || "Variasi"}: {v.name} {v.price > 0 && `(+${formatIdr(v.price)})`}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">Tidak ada opsi variasi tambahan.</p>
              )}

              {item.notes && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Catatan Khusus:</p>
                  <p className="text-xs text-gray-600 bg-amber-50 p-2.5 rounded-lg border border-amber-100 italic leading-relaxed">
                    "{item.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
