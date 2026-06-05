import { Suspense } from "react";
import { LocationManager } from "@/components/features/admin/locations/organisms/LocationManager";
import { getLocationsTree, getFlatLocations } from "@/services/admin/locationService";
import { LoadingSpinner } from "@/components/features/admin/core/atoms/LoadingSpinner";

export const metadata = {
  title: "Manajemen Lokasi & Ongkir | Admin",
  description: "Pengaturan wilayah pengiriman dan ongkos kirim.",
};

export default function AdminLocationsPage() {
  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Manajemen Lokasi & Ongkir</h1>
          <p className="text-gray-500">Atur hierarki wilayah pengiriman dan nominal ongkos kirim.</p>
        </div>
      </header>

      <Suspense fallback={<LoadingSpinner text="Memuat Data Lokasi..." className="py-20" />}>
        <LocationLoader />
      </Suspense>
    </div>
  );
}

async function LocationLoader() {
  const [locationsTree, flatLocations] = await Promise.all([
    getLocationsTree(),
    getFlatLocations()
  ]);

  return <LocationManager locationsTree={locationsTree} flatLocations={flatLocations} />;
}

