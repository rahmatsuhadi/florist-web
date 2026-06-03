import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSeoSettings, updateSeoSettings, SeoSettingsData } from "@/services/admin/seoService";

export function useSeo() {
  const [activeTab, setActiveTab] = useState("home");
  const [formData, setFormData] = useState<SeoSettingsData>({
    pageName: "home",
    title: "",
    description: "",
    keywords: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const loadData = async (pageName: string) => {
    setIsLoading(true);
    try {
      const data = await getSeoSettings(pageName);
      setFormData(data);
    } catch (error) {
      toast.error("Gagal memuat pengaturan SEO");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof SeoSettingsData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    
    try {
      const result = await updateSeoSettings(formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    formData,
    isLoading,
    isSaving,
    handleChange,
    handleSave
  };
}
