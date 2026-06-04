"use client";

import React, { useActionState, useEffect, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ContentTabBar } from "../molecules/ContentTabBar";
import { BannerEditorCard } from "../molecules/BannerEditorCard";
import { GalleryEditorCard } from "../molecules/GalleryEditorCard";
import {
  addBannerAction,
  addGalleryAction,
  reorderBannersAction,
  reorderGalleryAction,
} from "@/services/actions/contentActions";
import type { ActionState } from "@/services/actions/contentSchemas";
import type { HeroBannerData, GalleryItemData } from "@/services/admin/contentService";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ContentManagerProps {
  initialBanners: HeroBannerData[];
  initialGallery: GalleryItemData[];
}

const initialState: ActionState = { success: false, message: "" };

export const ContentManager: React.FC<ContentManagerProps> = ({
  initialBanners,
  initialGallery,
}) => {
  // Add banner action
  const [addBannerState, addBannerFormAction] = useActionState(addBannerAction, initialState);
  const [addGalleryState, addGalleryFormAction] = useActionState(addGalleryAction, initialState);

  // Reorder actions — called imperatively
  const [, reorderBannersFormAction] = useActionState(reorderBannersAction, initialState);
  const [, reorderGalleryFormAction] = useActionState(reorderGalleryAction, initialState);

  const [isPending, startTransition] = useTransition();

  // Toast feedback for add actions
  useEffect(() => {
    if (addBannerState.message) {
      if (addBannerState.success) toast.success(addBannerState.message);
      else toast.error(addBannerState.message);
    }
  }, [addBannerState]);

  useEffect(() => {
    if (addGalleryState.message) {
      if (addGalleryState.success) toast.success(addGalleryState.message);
      else toast.error(addGalleryState.message);
    }
  }, [addGalleryState]);

  const handleAddBanner = () => {
    const formData = new FormData();
    formData.append("imageUrl", "/images/hero.webp");
    formData.append("title", "Judul Banner Baru");
    formData.append("subtitle", "Deskripsi singkat banner baru");
    formData.append("position", String(initialBanners.length));
    formData.append("isActive", "true");
    startTransition(() => {
      addBannerFormAction(formData);
    });
  };

  const handleAddGallery = () => {
    const formData = new FormData();
    formData.append("imageUrl", "/images/gallery/g1.webp");
    formData.append("gridClass", "md:col-span-1 md:row-span-1");
    formData.append("altText", "Foto Galeri Baru");
    formData.append("position", String(initialGallery.length));
    formData.append("isActive", "true");
    startTransition(() => {
      addGalleryFormAction(formData);
    });
  };

  const handleReorderBanners = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return;
    const reordered = [...initialBanners];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const items = reordered
      .map((b, i) => ({ id: b.id!, position: i }))
      .filter((b) => b.id);

    const formData = new FormData();
    formData.append("items", JSON.stringify(items));
    startTransition(() => {
      reorderBannersFormAction(formData);
    });
  };

  const handleReorderGallery = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return;
    const reordered = [...initialGallery];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const items = reordered
      .map((g, i) => ({ id: g.id!, position: i }))
      .filter((g) => g.id);

    const formData = new FormData();
    formData.append("items", JSON.stringify(items));
    startTransition(() => {
      reorderGalleryFormAction(formData);
    });
  };

  return (
    <ContentTabBar>
      {(activeTab) => (
        <AnimatePresence mode="wait">
          {activeTab === "hero" ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-xl text-gray-900">
                    Pengaturan Banner
                  </h3>
                  <p className="text-sm text-gray-500">
                    Atur banner yang muncul di halaman utama paling atas.
                  </p>
                </div>
                <Button
                  onClick={handleAddBanner}
                  disabled={isPending}
                  className="flex items-center gap-2"
                >
                  <Plus size={18} /> Tambah Banner
                </Button>
              </div>

              <div className="grid gap-4">
                {initialBanners.map((banner, index) => (
                  <BannerEditorCard
                    key={banner.id || `b-${index}`}
                    banner={banner}
                    index={index}
                    onReorder={handleReorderBanners}
                  />
                ))}
                {initialBanners.length === 0 && (
                  <div className="text-center p-8 bg-gray-50 rounded-xl text-gray-500">
                    Belum ada banner. Klik &quot;Tambah Banner&quot; untuk memulai.
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-xl text-gray-900">
                    Pengaturan Galeri
                  </h3>
                  <p className="text-sm text-gray-500">
                    Atur foto-foto yang tampil di section galeri.
                  </p>
                </div>
                <Button
                  onClick={handleAddGallery}
                  disabled={isPending}
                  className="flex items-center gap-2"
                >
                  <Plus size={18} /> Tambah Foto
                </Button>
              </div>

              <div className="grid gap-4">
                {initialGallery.map((item, index) => (
                  <GalleryEditorCard
                    key={item.id || `g-${index}`}
                    item={item}
                    index={index}
                    onReorder={handleReorderGallery}
                  />
                ))}
                {initialGallery.length === 0 && (
                  <div className="text-center p-8 bg-gray-50 rounded-xl text-gray-500">
                    Belum ada foto galeri. Klik &quot;Tambah Foto&quot; untuk memulai.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </ContentTabBar>
  );
};
