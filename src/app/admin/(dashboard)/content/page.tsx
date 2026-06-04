import { ContentManager } from "@/components/features/admin/content/organisms/content/ContentManager";

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

      <ContentManager />
    </div>
  );
}
