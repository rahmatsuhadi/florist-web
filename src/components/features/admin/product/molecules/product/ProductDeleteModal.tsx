"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteProduct } from "@/services/admin/productService";

interface ProductDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: number;
  productName?: string;
}

export const ProductDeleteModal: React.FC<ProductDeleteModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!productId) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      toast.success("Produk berhasil dihapus");
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Gagal menghapus produk");
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
      >
        <div className="flex items-center gap-4 text-red-500 mb-4">
          <div className="p-3 bg-red-50 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-900">
            Hapus Produk?
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus produk{" "}
          <strong>{productName || "ini"}</strong>? Tindakan ini tidak dapat
          dibatalkan dan semua data beserta variannya akan dihapus secara
          permanen dari database.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            type="button"
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus Produk"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
