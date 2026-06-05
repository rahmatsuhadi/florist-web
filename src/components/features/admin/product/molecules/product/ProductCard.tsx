import React from "react";
import { Image as ImageIcon, Edit2, Package } from "lucide-react";
import { Product } from "@/services/admin/productService";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
}) => {
  const formatRupiah = (angka: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(angka));
  };

  return (
    <div className="bg-white rounded-2xl border border-brand/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
      <div className="h-56 overflow-hidden relative bg-gray-50 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ImageIcon size={40} className="text-gray-300" />
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-brand shadow-sm">
          {product.category}
        </div>

        {/* Indikator jumlah foto */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 shadow-sm">
            <ImageIcon size={10} /> +{product.images.length - 1}
          </div>
        )}

        <Link
          href={`/admin/products/${product.id}/edit`}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg text-gray-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-brand"
          title="Edit Produk"
        >
          <Edit2 size={16} />
        </Link>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto flex justify-between items-end border-t border-gray-100 pt-3">
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">
              Harga Dasar
            </p>
            <span className="font-semibold text-brand">
              {formatRupiah(product.basePrice)}
            </span>
          </div>
          {product.variantGroups && product.variantGroups.length > 0 && (
            <span className="text-[11px] px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium flex items-center gap-1">
              <Package size={12} /> {product.variantGroups.length} Varian
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
