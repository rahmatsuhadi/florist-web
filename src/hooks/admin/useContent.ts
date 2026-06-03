import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getHeroBanners,
  addHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  getGalleryItems,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  HeroBannerData,
  GalleryItemData
} from "@/services/admin/contentService";

export const useContent = () => {
  const [banners, setBanners] = useState<HeroBannerData[]>([]);
  const [gallery, setGallery] = useState<GalleryItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData(true);
  }, []);

  const fetchData = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const [bannersData, galleryData] = await Promise.all([
        getHeroBanners(),
        getGalleryItems()
      ]);
      setBanners(bannersData);
      setGallery(galleryData);
    } catch (error) {
      toast.error("Gagal memuat data konten.");
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  // BANNER HANDLERS
  const handleAddBanner = async () => {
    const newBanner: HeroBannerData = {
      imageUrl: "/images/hero.webp",
      title: "Judul Banner Baru",
      subtitle: "Deskripsi singkat banner baru",
      position: banners.length,
      isActive: true,
    };
    const res = await addHeroBanner(newBanner);
    if (res.success) {
      toast.success(res.message);
      fetchData();
    } else {
      toast.error(res.message);
    }
  };

  const handleUpdateBanner = async (id: number | undefined, data: HeroBannerData) => {
    if (!id) return;
    const res = await updateHeroBanner(id, data);
    if (res.success) {
      toast.success(res.message);
      fetchData();
    } else {
      toast.error(res.message);
    }
  };

  const handleDeleteBanner = async (id: number | undefined) => {
    if (!id) return;
    const res = await deleteHeroBanner(id);
    if (res.success) {
      toast.success(res.message);
      fetchData();
    } else {
      toast.error(res.message);
    }
  };

  // GALLERY HANDLERS
  const handleAddGallery = async () => {
    const newItem: GalleryItemData = {
      imageUrl: "/images/gallery/g1.webp",
      gridClass: "md:col-span-1 md:row-span-1",
      altText: "Foto Galeri Baru",
      position: gallery.length,
      isActive: true,
    };
    const res = await addGalleryItem(newItem);
    if (res.success) {
      toast.success(res.message);
      fetchData();
    } else {
      toast.error(res.message);
    }
  };

  const handleUpdateGallery = async (id: number | undefined, data: GalleryItemData) => {
    if (!id) return;
    const res = await updateGalleryItem(id, data);
    if (res.success) {
      toast.success(res.message);
      fetchData();
    } else {
      toast.error(res.message);
    }
  };

  const handleDeleteGallery = async (id: number | undefined) => {
    if (!id) return;
    const res = await deleteGalleryItem(id);
    if (res.success) {
      toast.success(res.message);
      fetchData();
    } else {
      toast.error(res.message);
    }
  };

  const handleReorderBanners = async (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return;
    const newBanners = [...banners];
    const [movedItem] = newBanners.splice(oldIndex, 1);
    newBanners.splice(newIndex, 0, movedItem);
    
    const reordered = newBanners.map((b, i) => ({ ...b, position: i }));
    setBanners(reordered);
    
    try {
      await Promise.all(reordered.map(b => {
        if (b.id) return updateHeroBanner(b.id, b);
      }));
    } catch (e) {
      toast.error("Gagal menyimpan urutan banner");
      fetchData(false);
    }
  };

  const handleReorderGallery = async (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return;
    const newGallery = [...gallery];
    const [movedItem] = newGallery.splice(oldIndex, 1);
    newGallery.splice(newIndex, 0, movedItem);
    
    const reordered = newGallery.map((g, i) => ({ ...g, position: i }));
    setGallery(reordered);
    
    try {
      await Promise.all(reordered.map(g => {
        if (g.id) return updateGalleryItem(g.id, g);
      }));
    } catch (e) {
      toast.error("Gagal menyimpan urutan galeri");
      fetchData(false);
    }
  };

  return {
    banners,
    gallery,
    isLoading,
    handleAddBanner,
    handleUpdateBanner,
    handleDeleteBanner,
    handleReorderBanners,
    handleAddGallery,
    handleUpdateGallery,
    handleDeleteGallery,
    handleReorderGallery,
  };
};
