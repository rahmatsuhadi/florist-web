import { create } from "zustand";
import type { StoreSettingsData } from "@/services/admin/storefrontService";

interface ShopStore extends StoreSettingsData {
  setShopInfo: (info: StoreSettingsData) => void;
}

export const useShopStore = create<ShopStore>((set) => ({
  id: 0,
  name: "",
  fullName: "",
  phone: "",
  phoneWa: "",
  instagram: "",
  address: "",
  openingHours: "",
  latitude: "",
  longitude: "",
  setShopInfo: (info) => set({ ...info }),
}));
