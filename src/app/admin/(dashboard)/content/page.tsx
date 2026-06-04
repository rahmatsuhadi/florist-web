import { Suspense } from "react";
import { getHeroBanners, getGalleryItems } from "@/services/admin/contentService";
import { ContentManager } from "@/components/features/admin/content/organisms/ContentManager";
import { LoadingSpinner } from "@/components/features/admin/core/atoms/LoadingSpinner";

export const metadata = {
  title: "Manajemen Konten | Admin",
};

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">
            Manajemen Konten
          </h1>
          <p className="text-gray-500">
            Atur banner hero dan foto galeri yang akan ditampilkan pada halaman depan pengunjung.
          </p>
        </div>
      </header>

      <Suspense fallback={<LoadingSpinner text="Memuat Konten..." className="py-20" />}>
        <ContentLoader />
      </Suspense>
    </div>
  );
}

/** Async Server Component — fetches data then passes to client ContentManager */
async function ContentLoader() {
  const [banners, gallery] = await Promise.all([
    getHeroBanners(),
    getGalleryItems(),
  ]);

  return (
    <ContentManager
      initialBanners={banners}
      initialGallery={gallery}
    />
  );
}

