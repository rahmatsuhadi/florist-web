"use client";

import { useRef } from "react";
import { useShopStore } from "@/store/shopStore";
import type { StoreSettingsData } from "@/services/admin/storefrontService";

interface StoreInitializerProps {
  initialData: StoreSettingsData;
}

export const StoreInitializer = ({ initialData }: StoreInitializerProps) => {
  const initialized = useRef(false);

  if (!initialized.current) {
    useShopStore.setState(initialData);
    initialized.current = true;
  }

  return null;
};
