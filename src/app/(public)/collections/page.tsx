import type { Metadata } from "next";
import { getSeoSettings } from "@/services/admin/seoService";
import { CATEGORIES, Category } from "@/constants/mockData";
import { CategoryCard } from "@/components/features/product/molecules/CategoryCard";
import { StaggerWrapper } from "@/components/ui/MotionWrappers";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
  return (
    <div className="pt-32 pb-24 bg-[#FAFAF7] min-h-screen">
      <div className="container mx-auto px-6">
        <SectionHeading
          title="Semua Kategori"
          subtitle="Pilih kategori momen spesial Anda."
          level="h1"
        />
        <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat: Category) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </StaggerWrapper>
      </div>
    </div>
  );
}
