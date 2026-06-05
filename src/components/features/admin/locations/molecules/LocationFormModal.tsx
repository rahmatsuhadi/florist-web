"use client";

import React, { useActionState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { saveLocationAction } from "@/services/actions/locationActions";
import type { ActionState } from "@/services/actions/locationSchemas";
import type { LocationItemData } from "@/services/admin/locationService";
import { LocationSaveButton } from "../atoms/LocationSaveButton";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { motion } from "framer-motion";

interface LocationFormModalProps {
  onClose: () => void;
  locationToEdit: LocationItemData | null;
  parentToAssign: number | null; // ID of the parent if adding a child
  flatLocations: LocationItemData[]; // Array of all locations for the parent dropdown
}

const initialState: ActionState = { success: false, message: "" };

export const LocationFormModal: React.FC<LocationFormModalProps> = ({
  onClose,
  locationToEdit,
  parentToAssign,
  flatLocations,
}) => {
  const [state, formAction] = useActionState(saveLocationAction, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        onClose();
      } else {
        toast.error(state.message);
      }
    }
  }, [state, onClose]);

  // Prevent selecting itself or its children as parent (basic protection, in real app needs deeper recursive check)
  const availableParents = flatLocations.filter((loc) => loc.id !== locationToEdit?.id);

  const defaultParentId = locationToEdit 
    ? (locationToEdit.parentId ? String(locationToEdit.parentId) : "") 
    : (parentToAssign ? String(parentToAssign) : "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />
      
      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">
            {locationToEdit ? "Edit Wilayah" : "Tambah Wilayah"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form action={formAction} className="p-5 space-y-4">
          <input type="hidden" name="id" value={locationToEdit?.id || ""} />

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-semibold text-gray-900">
              Nama Wilayah
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={locationToEdit?.name || ""}
              placeholder="Contoh: Bantul"
              className="w-full px-3 py-2 bg-gray-50 border border-brand/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white transition-all text-sm text-gray-900"
            />
            {state.errors?.name && (
              <span className="text-xs font-semibold text-red-500">{state.errors.name[0]}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="shippingCost" className="text-sm font-semibold text-gray-900">
              Nominal Ongkos Kirim
            </label>
            <CurrencyInput
              id="shippingCost"
              name="shippingCost"
              defaultValue={locationToEdit?.shippingCost || ""}
              placeholder="Contoh: 15.000 (Kosongkan jika ikut induk)"
              className="bg-white"
            />
            {state.errors?.shippingCost && (
              <span className="text-xs font-semibold text-red-500">{state.errors.shippingCost[0]}</span>
            )}
            <p className="text-xs text-gray-500">Kosongkan jika wilayah ini tidak memiliki ongkir khusus.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="parentId" className="text-sm font-semibold text-gray-900">
              Induk Wilayah (Parent)
            </label>
            <select
              id="parentId"
              name="parentId"
              defaultValue={defaultParentId}
              className="w-full px-3 py-2 bg-gray-50 border border-brand/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white transition-all text-sm text-gray-900 cursor-pointer"
            >
              <option value="">-- Paling Atas (Root) --</option>
              {availableParents.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            {state.errors?.parentId && (
              <span className="text-xs font-semibold text-red-500">{state.errors.parentId[0]}</span>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Batal
            </button>
            <LocationSaveButton />
          </div>
        </form>
      </motion.div>
    </div>
  );
};
