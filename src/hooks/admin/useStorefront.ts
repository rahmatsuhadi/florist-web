import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getStoreSettings, updateStoreSettings, StoreSettingsData } from "@/services/admin/storefrontService";

export const useStorefront = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    phone: "",
    phoneWa: "",
    instagram: "",
    address: "",
    openingHours: "",
    latitude: -7.9854932,
    longitude: 110.2284877,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getStoreSettings();
        setFormData({
          ...data,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
        });
      } catch (error) {
        toast.error("Gagal memuat data toko.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    
    try {
      const result = await updateStoreSettings({
        ...formData,
        latitude: String(formData.latitude),
        longitude: String(formData.longitude),
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    isLoading,
    isSaving,
    handleChange,
    handleLocationChange,
    handleSave,
  };
};
