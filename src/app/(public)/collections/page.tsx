import CollectionsPageClient from "@/components/organisms/collections/CollectionsPageClient";
import type { Metadata } from "next";

import { getSeoSettings } from "@/services/admin/seoService";

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSeoSettings("products", true);

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords ? seoData.keywords.split(",").map(k => k.trim()) : [],
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      type: "website",
    },
  };
}

export default function CollectionsPage() {
  return <CollectionsPageClient />;
}
