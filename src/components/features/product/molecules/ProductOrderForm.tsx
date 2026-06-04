"use client";

import type React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProductOrderFormProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  onAddToCart: () => void;
}

export const ProductOrderForm: React.FC<ProductOrderFormProps> = ({
  notes,
  onNotesChange,
  onAddToCart,
}) => {
  return (
    <>
      <div className="mb-8">
        <h3 className="font-playfair text-lg text-[#2C302E] mb-2">
          Catatan untuk Perangkai / Kartu Ucapan
        </h3>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Misal: Tolong pita warna merah ya, atau tuliskan 'Happy Birthday Budi' di kartu..."
          className="w-full border border-[#E8D9D2] bg-transparent py-3 px-4 focus:outline-none focus:border-[#829E8D] transition-colors font-sans text-[#2C302E] resize-none h-24 shadow-sm"
        />
      </div>

      <div className="space-y-4">
        <Button
          onClick={onAddToCart}
          className="w-full text-lg py-4 border-0"
        >
          Tambah ke Keranjang
        </Button>
        <p className="text-center text-xs text-[#5A635E] font-sans mt-4 flex items-center justify-center gap-2">
          <Star size={14} /> Rangkaian eksklusif, dibuat berdasarkan pesanan.
        </p>
      </div>
    </>
  );
};
