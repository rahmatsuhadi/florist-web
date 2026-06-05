import { Suspense } from "react";
import { SeoManager } from "@/components/features/admin/seo/organisms/seo/SeoManager";
import { getSeoSettings } from "@/services/admin/seoService";
import { LoadingSpinner } from "@/components/features/admin/core/atoms/LoadingSpinner";

export const metadata = {
  title: "SEO Manager | Admin",
  description: "Manajemen SEO",
};

export default function AdminSeoPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">SEO Manager</h1>
          <p className="text-gray-500">Optimasi meta tag untuk meningkatkan visibilitas pencarian Google.</p>
        </div>
      </header>

      <Suspense fallback={<LoadingSpinner text="Memuat Pengaturan SEO..." className="py-20" />}>
        <SeoLoader />
      </Suspense>
    </div>
  );
}

async function SeoLoader() {
  const [home, products, categories] = await Promise.all([
    getSeoSettings("home"),
    getSeoSettings("products"),
    getSeoSettings("categories")
  ]);

  return <SeoManager initialData={{ home, products, categories }} />;
}

