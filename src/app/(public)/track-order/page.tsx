import { Metadata } from "next";
import { TrackOrderClient } from "./TrackOrderClient";

import { getStoreSettings } from "@/services/admin/storefrontService";

export async function generateMetadata(): Promise<Metadata> {
  const storeSettings = await getStoreSettings();
  const storeName = storeSettings.name || "Florist";

  return {
    title: `Lacak Pesanan | ${storeName}`,
    description: `Lacak status pesanan bunga Anda di ${storeName}`,
  };
}

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
