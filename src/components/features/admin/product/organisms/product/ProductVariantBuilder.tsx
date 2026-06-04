"use client";

import React, { useState } from "react";
import { Plus, Package, Trash2, Camera, X } from "lucide-react";
import { ProductVariantGroup } from "@/services/admin/productService";
import { uploadImageAction, removeImageAction } from "@/services/admin/storageService";
import { CurrencyInput } from "@/components/ui/CurrencyInput";

interface ProductVariantBuilderProps {
  initialVariants?: ProductVariantGroup[];
}

export const ProductVariantBuilder: React.FC<ProductVariantBuilderProps> = ({
  initialVariants = [],
}) => {
  const [variantGroups, setVariantGroups] = useState<ProductVariantGroup[]>(initialVariants);
  const [uploadingOptions, setUploadingOptions] = useState<Record<string, boolean>>({});

  const handleAddVariantGroup = () => {
    setVariantGroups((prev) => [
      ...prev,
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
    ]);
  };

  const handleRemoveVariantGroup = (groupId: string) => {
    setVariantGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleAddOption = (groupId: string) => {
    setVariantGroups((prev) =>
      prev.map((g) => {
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
      })
    );
  };

  const handleRemoveVariantImage = async (groupId: string, optionId: string) => {
    const group = variantGroups.find((g) => g.id === groupId);
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
    const group = variantGroups.find((g) => g.id === groupId);
    const option = group?.options.find((o) => o.id === optionId);

    if (option?.image && option.image.startsWith("http")) {
      try {
        await removeImageAction(option.image);
      } catch (error) {
        console.error("Failed to delete variant image:", error);
      }
    }

    setVariantGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return { ...g, options: g.options.filter((o) => o.id !== optionId) };
        }
        return g;
      })
    );
  };

  const handleGroupChange = (groupId: string, field: string, value: string) => {
    setVariantGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, [field]: value } : g))
    );
  };

  const handleOptionChange = (
    groupId: string,
    optionId: string,
    field: string,
    value: string
  ) => {
    setVariantGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            options: g.options.map((o) =>
              o.id === optionId ? { ...o, [field]: value } : o
            ),
          };
        }
        return g;
      })
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <input type="hidden" name="variantGroups" value={JSON.stringify(variantGroups)} />

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
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-[#FDFBF7] border border-brand/20 text-brand rounded-xl hover:bg-brand/5 transition font-medium text-sm"
        >
          <Plus size={16} /> Tambah Grup Varian
        </button>
      </div>

      {variantGroups.length === 0 ? (
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
          {variantGroups.map((group) => (
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
                  type="button"
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
                      <label
                        className={`w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 cursor-pointer overflow-visible group relative ${
                          uploadingOptions[option.id] ? "opacity-70 pointer-events-none" : ""
                        }`}
                      >
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
                          <Camera size={16} />
                        )}

                        {!uploadingOptions[option.id] && !option.image && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <Camera size={14} className="text-white" />
                          </div>
                        )}

                        {uploadingOptions[option.id] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-lg">
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

                            setUploadingOptions((prev) => ({ ...prev, [option.id]: true }));

                            try {
                              const url = await uploadImageAction(formData, "variants");
                              handleOptionChange(group.id, option.id, "image", url);
                            } catch (error) {
                              console.error("Failed to upload variant image", error);
                            } finally {
                              setUploadingOptions((prev) => ({ ...prev, [option.id]: false }));
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
                          handleOptionChange(group.id, option.id, "name", e.target.value)
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
                      <CurrencyInput
                        value={option.price}
                        onValueChange={(val) =>
                          handleOptionChange(group.id, option.id, "price", val)
                        }
                        placeholder="0"
                        className="py-1.5 text-sm"
                      />
                    </div>

                    {/* Delete Option */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => handleRemoveOption(group.id, option.id)}
                        type="button"
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
                type="button"
                className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand hover:underline px-2"
              >
                <Plus size={16} /> Tambah Opsi Varian
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
