"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ChevronLeft, Camera, Trash2, Plus, Package, Image as ImageIcon, X, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product, ProductVariantGroup, deleteProduct } from "@/services/admin/productService";
import { uploadImageAction, removeImageAction } from "@/services/admin/storageService";
import { CATEGORIES } from "@/constants/mockData";

interface ProductFormProps {
  initialData?: Product | null;
  onSave: (data: Omit<Product, "id">) => Promise<any>;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSave }) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ localUrl: string }[]>([]);
  const [uploadingOptions, setUploadingOptions] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    basePrice: initialData?.basePrice || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    images: initialData?.images || [],
    variantGroups: initialData?.variantGroups || [],
  });

  const handleMainImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const tempFiles = files.map((file) => ({
      file,
      localUrl: URL.createObjectURL(file),
    }));

    setUploadingFiles((prev) => [...prev, ...tempFiles.map((t) => ({ localUrl: t.localUrl }))]);

    try {
      const uploadPromises = tempFiles.map(async (temp) => {
        const formData = new FormData();
        formData.append("file", temp.file);
        try {
          const url = await uploadImageAction(formData, "products");
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, url],
          }));
        } finally {
          setUploadingFiles((prev) => prev.filter((p) => p.localUrl !== temp.localUrl));
          URL.revokeObjectURL(temp.localUrl);
        }
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunggah foto produk.");
    } finally {
      setUploadingFiles([]);
    }
  };

  const handleRemoveMainImage = async (indexToRemove: number) => {
    const imageUrl = formData.images[indexToRemove];

    // Optimistically remove from state
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));

    // If it's a remote URL from Supabase, actually delete it
    if (imageUrl.startsWith("http")) {
      try {
        await removeImageAction(imageUrl);
      } catch (error) {
        console.error("Failed to delete remote image:", error);
      }
    }
  };

  const handleAddVariantGroup = () => {
    setFormData((prev) => ({
      ...prev,
      variantGroups: [
        ...prev.variantGroups,
        {
          id: `vg_${Date.now()}`,
          name: "",
          options: [
            {
              id: `opt_${Date.now()}`,
              name: "",
              priceType: "add" as const,
              price: "0",
              image: null,
            },
          ],
        },
      ],
    }));
  };

  const handleRemoveVariantGroup = (groupId: string) => {
    setFormData((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.filter((g) => g.id !== groupId),
    }));
  };

  const handleAddOption = (groupId: string) => {
    setFormData((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            options: [
              ...g.options,
              {
                id: `opt_${Date.now()}`,
                name: "",
                priceType: "add" as const,
                price: "0",
                image: null,
              },
            ],
          };
        }
        return g;
      }),
    }));
  };

  const handleRemoveVariantImage = async (groupId: string, optionId: string) => {
    const group = formData.variantGroups.find((g) => g.id === groupId);
    const option = group?.options.find((o) => o.id === optionId);

    if (option?.image) {
      if (option.image.startsWith("http")) {
        try {
          await removeImageAction(option.image);
        } catch (error) {
          console.error("Failed to delete variant image:", error);
        }
      }
      handleOptionChange(groupId, optionId, "image", "");
    }
  };

  const handleRemoveOption = async (groupId: string, optionId: string) => {
    // Find the option to see if it has an image to delete
    const group = formData.variantGroups.find(g => g.id === groupId);
    const option = group?.options.find(o => o.id === optionId);

    if (option?.image && option.image.startsWith("http")) {
      try {
        await removeImageAction(option.image);
      } catch (error) {
        console.error("Failed to delete variant image:", error);
      }
    }

    setFormData((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.map((g) => {
        if (g.id === groupId) {
          return { ...g, options: g.options.filter((o) => o.id !== optionId) };
        }
        return g;
      }),
    }));
  };

  const handleGroupChange = (groupId: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.map((g) =>
        g.id === groupId ? { ...g, [field]: value } : g
      ),
    }));
  };

  const handleOptionChange = (groupId: string, optionId: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            options: g.options.map((o) =>
              o.id === optionId ? { ...o, [field]: value } : o
            ),
          };
        }
        return g;
      }),
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to save product", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    setIsDeleting(true);
    try {
      await deleteProduct(initialData.id);
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Gagal menghapus produk");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-20"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-brand/10 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/products")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-gray-900">
              {initialData ? "Edit Produk" : "Buat Produk Baru"}
            </h1>
            <p className="text-sm text-gray-500">
              Atur detail produk, foto utama, dan variasi.
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          {initialData && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition"
              type="button"
            >
              Hapus
            </button>
          )}
          <button
            onClick={() => router.push("/admin/products")}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 bg-brand text-white rounded-xl font-medium hover:bg-brand-hover transition disabled:opacity-70 flex items-center gap-2"
          >
            {isSaving ? "Menyimpan..." : "Simpan Produk"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Informasi Dasar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-5">
            <h2 className="font-serif text-lg font-semibold text-gray-900 border-b pb-3">
              Informasi Dasar
            </h2>

            {/* Foto Utama */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Galeri Produk
                </label>
                <span className="text-xs text-gray-500">
                  {formData.images.length} Foto
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200"
                  >
                    <img
                      src={img}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover"
                    />

                    {idx === 0 && (
                      <div className="absolute top-1.5 left-1.5 bg-brand text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        UTAMA
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleRemoveMainImage(idx)}
                        className="p-1.5 bg-white text-red-500 rounded-lg hover:bg-red-50 shadow-sm transition-colors"
                        title="Hapus Foto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {uploadingFiles.map((temp, idx) => (
                  <div
                    key={`uploading-${idx}`}
                    className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200"
                  >
                    <img
                      src={temp.localUrl}
                      alt="uploading"
                      className="w-full h-full object-cover blur-sm opacity-60 grayscale"
                    />

                    {/* Animated indeterminate progress bar */}
                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gray-100/50 backdrop-blur-sm overflow-hidden">
                      <motion.div
                        className="h-full bg-brand"
                        initial={{ width: "0%", x: "-100%" }}
                        animate={{ width: "40%", x: "300%" }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>

                    {/* Centered Spinner */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                    </div>
                  </div>
                ))}


                <label className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-brand/50 hover:bg-gray-50/80 transition-colors cursor-pointer">
                  <Camera size={20} className="mb-1" />
                  <span className="text-[10px] font-medium text-gray-500">
                    Tambah Foto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleMainImagesUpload}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Foto pertama akan menjadi cover/thumbnail produk.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Produk
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand outline-none bg-gray-50/50"
                placeholder="Contoh: Classic Red Rose"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand outline-none bg-gray-50/50 appearance-none"
              >
                <option value="">Pilih Kategori</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Harga Dasar (Rp)
              </label>
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({ ...formData, basePrice: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand outline-none bg-gray-50/50"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Deskripsi
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand outline-none bg-gray-50/50 resize-none"
                placeholder="Tuliskan deskripsi produk..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Variasi Sistem */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center border-b pb-3 mb-5">
              <div>
                <h2 className="font-serif text-lg font-semibold text-gray-900">
                  Varian Produk (Opsional)
                </h2>
                <p className="text-sm text-gray-500 font-sans">
                  Tambahkan opsi seperti ukuran, jenis bunga, atau warna pita.
                </p>
              </div>
              <button
                onClick={handleAddVariantGroup}
                className="flex items-center gap-2 px-4 py-2 bg-[#FDFBF7] border border-brand/20 text-brand rounded-xl hover:bg-brand/5 transition font-medium text-sm"
              >
                <Plus size={16} /> Tambah Grup Varian
              </button>
            </div>

            {formData.variantGroups.length === 0 ? (
              <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <Package size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">
                  Produk ini belum memiliki varian.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Gunakan harga dasar jika produk tidak memiliki pilihan lain.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.variantGroups.map((group) => (
                  <div
                    key={group.id}
                    className="border border-gray-200 rounded-xl p-5 bg-gray-50/30"
                  >
                    <div className="flex gap-4 items-start mb-4">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Nama Grup Varian
                        </label>
                        <input
                          type="text"
                          value={group.name}
                          onChange={(e) =>
                            handleGroupChange(group.id, "name", e.target.value)
                          }
                          placeholder="Contoh: Ukuran Buket, Warna Kertas, dll"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand outline-none bg-white font-medium"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveVariantGroup(group.id)}
                        className="mt-6 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* Table Header for Options */}
                      <div className="grid grid-cols-12 gap-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-2 text-center">Foto</div>
                        <div className="col-span-3">Nama Opsi</div>
                        <div className="col-span-3">Pengaturan Harga</div>
                        <div className="col-span-3">Nominal (Rp)</div>
                        <div className="col-span-1"></div>
                      </div>

                      {group.options.map((option) => (
                        <div
                          key={option.id}
                          className="grid grid-cols-12 gap-3 items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="col-span-2 flex justify-center">
                            <label className={`w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 cursor-pointer overflow-visible group relative ${uploadingOptions[option.id] ? "opacity-70 pointer-events-none" : ""}`}>
                              {option.image ? (
                                <>
                                  <img
                                    src={option.image}
                                    alt="variant"
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleRemoveVariantImage(group.id, option.id);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 hover:bg-red-600 hover:scale-110"
                                    title="Hapus foto varian"
                                  >
                                    <X size={12} strokeWidth={3} />
                                  </button>
                                </>
                              ) : (
                                <ImageIcon size={16} />
                              )}

                              {!uploadingOptions[option.id] && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Camera size={14} className="text-white" />
                                </div>
                              )}

                              {uploadingOptions[option.id] && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                                  <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                                </div>
                              )}

                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingOptions[option.id]}
                                onChange={async (e) => {
                                  if (!e.target.files?.[0]) return;
                                  const formData = new FormData();
                                  formData.append("file", e.target.files[0]);

                                  setUploadingOptions(prev => ({ ...prev, [option.id]: true }));

                                  try {
                                    const url = await uploadImageAction(formData, "variants");
                                    handleOptionChange(group.id, option.id, "image", url);
                                  } catch (error) {
                                    console.error("Failed to upload variant image", error);
                                  } finally {
                                    setUploadingOptions(prev => ({ ...prev, [option.id]: false }));
                                  }
                                }}
                              />
                            </label>
                          </div>

                          {/* Option Name */}
                          <div className="col-span-3">
                            <input
                              type="text"
                              value={option.name}
                              onChange={(e) =>
                                handleOptionChange(
                                  group.id,
                                  option.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="M, L, Putih, dll"
                              className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:border-brand outline-none text-sm"
                            />
                          </div>

                          {/* Option Price Type */}
                          <div className="col-span-3">
                            <select
                              value={option.priceType}
                              onChange={(e) =>
                                handleOptionChange(
                                  group.id,
                                  option.id,
                                  "priceType",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:border-brand outline-none text-sm appearance-none bg-gray-50"
                            >
                              <option value="add">Tambah Harga</option>
                              <option value="replace">Ganti Harga Dasar</option>
                            </select>
                          </div>

                          {/* Option Price Value */}
                          <div className="col-span-3">
                            <input
                              type="number"
                              value={option.price}
                              onChange={(e) =>
                                handleOptionChange(
                                  group.id,
                                  option.id,
                                  "price",
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:border-brand outline-none text-sm"
                            />
                          </div>

                          {/* Delete Option */}
                          <div className="col-span-1 flex justify-center">
                            <button
                              onClick={() =>
                                handleRemoveOption(group.id, option.id)
                              }
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                              disabled={group.options.length === 1}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleAddOption(group.id)}
                      className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand hover:underline px-2"
                    >
                      <Plus size={16} /> Tambah Opsi Varian
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
              Apakah Anda yakin ingin menghapus produk <strong>{formData.name || "ini"}</strong>? Tindakan ini tidak dapat dibatalkan dan semua data beserta variannya akan dihapus secara permanen dari database.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Produk"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
