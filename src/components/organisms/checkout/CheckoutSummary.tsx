"use client";

import React from "react";
import Image from "next/image";
import { formatIdr } from "@/utils/format";
import { Button } from "@/components/atoms/Button";
import { CartItem } from "@/store/AppContext";

interface Props {
  cart: CartItem[];
  cartTotal: number;
  deliveryMethod: "delivery" | "pickup";
  isSubmitting: boolean;
  handleCheckout: () => void;
}

export const CheckoutSummary: React.FC<Props> = ({
  cart,
  cartTotal,
  deliveryMethod,
  isSubmitting,
  handleCheckout,
}) => {
  return (
    <div className="bg-white p-6 rounded-none shadow-sm border border-[#E8D9D2] sticky top-24">
      <h2 className="font-playfair text-xl text-[#2C302E] mb-6">Ringkasan Pesanan</h2>

      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
        {cart.map((item) => (
          <div key={item.cartItemId} className="flex gap-4 items-start">
            <div className="relative w-16 h-16 rounded-none overflow-hidden shrink-0 border border-[#E8D9D2]">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-brand text-white rounded-none flex items-center justify-center text-xs font-bold shadow-sm">
                {item.qty}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-[#2C302E] line-clamp-2">{item.name}</h4>
              {item.variantsText && <p className="text-xs text-gray-500 mt-0.5">{item.variantsText}</p>}
              {item.notes && (
                <p className="text-[11px] text-amber-600 mt-1 bg-amber-50 p-1.5 rounded-sm border border-amber-100 italic">
                  Catatan: {item.notes}
                </p>
              )}
              <p className="text-sm font-semibold text-[#829E8D] mt-1">{formatIdr(item.price)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#E8D9D2] pt-4 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{formatIdr(cartTotal)}</span>
        </div>
        {/* <div className="flex justify-between text-sm text-gray-600">
          <span>Ongkos Kirim</span>
          <span>{deliveryMethod === "delivery" ? "Dihitung nanti" : "Rp 0"}</span>
        </div> */}
        <div className="flex justify-between font-bold text-lg text-[#2C302E] pt-3 border-t border-dashed border-gray-200">
          <span>Total</span>
          <span>{formatIdr(cartTotal)}</span>
        </div>
      </div>

      <Button
        className="w-full mt-6 bg-[#2C302E] hover:bg-[#1A1C1B] text-white rounded-none"
        onClick={handleCheckout}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Memproses...' : 'Selesaikan Pesanan'}
      </Button>
      <p className="text-center text-xs text-gray-400 mt-4">
        Anda akan diarahkan ke Detail Pesanan setelah pesanan dibuat untuk memproses pembayaran.
      </p>
    </div>
  );
};
