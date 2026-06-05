"use client";

import React, { useState } from "react";
import { Plus, ChevronDown, ChevronRight, MapPin, Edit2, Trash2 } from "lucide-react";
import type { LocationItemData } from "@/services/admin/locationService";
import { LocationFormModal } from "../molecules/LocationFormModal";
import { ConfirmModal } from "@/components/features/admin/core/molecules/ConfirmModal";
import { deleteLocationAction } from "@/services/actions/locationActions";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

interface LocationManagerProps {
  locationsTree: LocationItemData[];
  flatLocations: LocationItemData[];
}

export const LocationManager: React.FC<LocationManagerProps> = ({ locationsTree, flatLocations }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [locationToEdit, setLocationToEdit] = useState<LocationItemData | null>(null);
  const [parentToAssign, setParentToAssign] = useState<number | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);

  const handleAdd = (parentId: number | null = null) => {
    setLocationToEdit(null);
    setParentToAssign(parentId);
    setIsFormOpen(true);
  };

  const handleEdit = (location: LocationItemData) => {
    setLocationToEdit(location);
    setParentToAssign(null);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (id: number) => {
    setLocationToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!locationToDelete) return;
    setIsConfirmOpen(false);
    
    const formData = new FormData();
    formData.append("id", String(locationToDelete));
    
    const result = await deleteLocationAction({ success: false, message: "" }, formData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-brand/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <MapPin size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Daftar Wilayah</h3>
            <p className="text-xs text-gray-500">Wilayah yang tidak diisi ongkir akan mengambil nilai dari parent-nya (jika ada).</p>
          </div>
        </div>
        <button 
          onClick={() => handleAdd()}
          className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-brand/20 shrink-0"
        >
          <Plus size={16} />
          Tambah Lokasi Induk
        </button>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-xl border border-brand/20 shadow-sm overflow-hidden overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-7 pl-4">Nama Wilayah</div>
            <div className="col-span-3 text-right">Ongkos Kirim</div>
            <div className="col-span-2 text-right pr-4">Aksi</div>
          </div>
          
          {/* Tree Render */}
          <div className="divide-y divide-gray-100">
            {locationsTree.length > 0 ? (
              locationsTree.map(loc => (
                <LocationRow 
                  key={loc.id} 
                  location={loc} 
                  level={0} 
                  onAddChild={handleAdd}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                Belum ada data wilayah. Silakan tambah lokasi baru.
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <LocationFormModal 
            onClose={() => setIsFormOpen(false)} 
            locationToEdit={locationToEdit}
            parentToAssign={parentToAssign}
            flatLocations={flatLocations}
          />
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Wilayah"
        message="Apakah Anda yakin ingin menghapus wilayah ini? Jika wilayah ini memiliki anak, maka anak-anaknya juga akan terhapus."
        confirmText="Hapus Wilayah"
      />
    </div>
  );
};


interface LocationRowProps {
  location: LocationItemData;
  level: number;
  onAddChild: (parentId: number) => void;
  onEdit: (location: LocationItemData) => void;
  onDelete: (id: number) => void;
}

const LocationRow: React.FC<LocationRowProps> = ({ location, level, onAddChild, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = location.children && location.children.length > 0;
  
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <div className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50/50 transition-colors ${level === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
        <div className="col-span-7 flex items-center gap-2" style={{ paddingLeft: `${level * 1.5 + 1}rem` }}>
          {hasChildren ? (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-6" /> // spacer
          )}
          <span className={`text-sm ${level === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
            {location.name}
          </span>
          <button 
            onClick={() => onAddChild(location.id)}
            className="opacity-0 hover:opacity-100 group-hover:opacity-100 ml-2 p-1 text-xs text-brand bg-brand/10 hover:bg-brand/20 rounded transition-all"
            title="Tambah wilayah di bawah ini"
          >
            + Sub-wilayah
          </button>
        </div>
        
        <div className="col-span-3 text-right">
          {location.shippingCost !== null ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-brand/10 text-brand">
              {formatRupiah(location.shippingCost)}
            </span>
          ) : (
            <span className="text-xs text-gray-400 italic">Ikut Induk</span>
          )}
        </div>
        
        <div className="col-span-2 flex justify-end items-center gap-2 pr-4">
          <button 
            onClick={() => onEdit(location)}
            className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => onDelete(location.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="w-full">
          {location.children!.map(child => (
            <LocationRow 
              key={child.id} 
              location={child} 
              level={level + 1} 
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
};
