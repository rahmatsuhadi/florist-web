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
        <span className="text-sm text-gray-500 font-medium">
          Dipesan {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
          })}
        </span>
      </div>

      <div className="space-y-4">
        {transaction.items.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row gap-5 items-start bg-[#FDFBF7]/60 p-5 rounded-2xl border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
              {item.productImage ? (
                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
              ) : (
                <Sparkles size={28} className="text-brand" />
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs bg-brand/15 text-brand px-2.5 py-1 inline-block rounded-full font-bold uppercase mb-1.5">{item.productCategory || "Umum"}</span>
                  <h4 className="font-serif font-bold text-xl text-gray-950">{item.productName} <span className="text-base font-medium text-gray-500">(x{item.quantity})</span></h4>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-lg text-brand font-sans">{formatIdr(Number(item.productPrice) * item.quantity)}</p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-400 font-sans mt-0.5">{formatIdr(Number(item.productPrice))} / item</p>
                  )}
                </div>
              </div>

              {item.variantDetails && (item.variantDetails as VariantDetail[]).length > 0 ? (
                <div className="pt-2 space-y-1.5">
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Opsi Variasi:</p>
                  <div className="flex flex-wrap gap-2">
                    {(item.variantDetails as VariantDetail[]).map((v, i) => (
                      <span key={i} className="text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium shadow-sm flex items-center gap-1.5">
                        <Check size={14} className="text-brand" /> {v.groupName || "Variasi"}: {v.name} {v.price > 0 && `(+${formatIdr(v.price)})`}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Tidak ada opsi variasi tambahan.</p>
              )}

              {item.notes && (
                <div className="pt-2">
                  <p className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-1.5">Catatan Khusus:</p>
                  <p className="text-sm text-gray-700 bg-amber-50 p-3 rounded-xl border border-amber-100 italic leading-relaxed">
                    "{item.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-200 pt-5 mt-4 space-y-3">
        <div className="flex justify-between text-base text-gray-600">
          <span>Subtotal Produk</span>
          <span>{formatIdr(Number(transaction.totalAmount) - (Number(transaction.shippingCost) || 0))}</span>
        </div>
        {/* @ts-ignore */}
        {transaction.deliveryMethod === "delivery" && (
          <div className="flex justify-between text-base text-gray-600">
            <span>Biaya Pengiriman</span>
            <span>{transaction.shippingCost ? formatIdr(Number(transaction.shippingCost)) : "Gratis / Tidak Ditetapkan"}</span>
          </div>
        )}
        <div className="flex justify-between font-serif font-bold text-gray-900 text-xl border-t border-gray-100 pt-4 mt-2">
          <span>Total Tagihan Keseluruhan</span>
          <span className="text-brand font-sans font-bold">{formatIdr(Number(transaction.totalAmount))}</span>
        </div>
      </div>
    </div>
  );
};
