import type { Metadata } from "next";
import { CollectionsPageClient } from "../../components/organisms/collections/CollectionsPageClient";

export const metadata: Metadata = {
  title: "Koleksi Bunga Premium",
  description:
    "Pilih dan telusuri berbagai macam pilihan koleksi buket bunga premium untuk momen terindah Anda di L'Fleur Mattz.",
  openGraph: {
    title: "Koleksi Bunga Premium | L'Fleur Mattz Florist",
    description:
      "Telusuri berbagai macam pilihan koleksi buket bunga premium untuk wisuda, pernikahan, anniversary, dan momen spesial Anda.",
    type: "website",
  },
};

export default function CollectionsPage() {
  return <CollectionsPageClient />;
}
