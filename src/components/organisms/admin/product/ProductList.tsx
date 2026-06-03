"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product, getProducts } from "@/services/admin/productService";
import { ProductCard } from "@/components/molecules/admin/product/ProductCard";
import { CATEGORIES } from "@/constants/mockData";

export const ProductList = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "Semua" || product.category === selectedCategory;
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleEdit = (product: Product) => {
    router.push(`/admin/products/${product.id}/edit`);
  };

  const handleAdd = () => {
    router.push(`/admin/products/new`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-4 border-brand/30 border-t-brand rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">
            Katalog Produk
          </h1>
          <p className="text-gray-500">
            Kelola inventory, harga, dan variasi rangkaian bunga.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="pl-10 pr-4 py-2.5 bg-white border border-brand/20 rounded-xl outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all w-full sm:w-64 shadow-sm"
            />
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-hover transition shadow-sm font-medium whitespace-nowrap"
          >
            <Plus size={18} /> Tambah Baru
          </button>
        </div>
      </header>

      {/* Filter Kategori */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[{ id: "Semua", name: "Semua Kategori" }, ...CATEGORIES].map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? "bg-brand text-white shadow-sm"
                : "bg-white border border-brand/20 text-gray-600 hover:bg-brand/5"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Grid Produk */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-brand/10 shadow-sm flex flex-col items-center justify-center">
          <Package size={48} className="text-gray-300 mb-4" />
          <h3 className="font-serif text-lg font-medium text-gray-900 mb-1">
            Produk tidak ditemukan
          </h3>
          <p className="text-gray-500 text-sm font-sans">
            Coba ubah kata kunci pencarian atau filter kategori Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </motion.div>
  );
};
