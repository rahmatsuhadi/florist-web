import { getProducts } from "@/services/admin/productService";
import { getHeroBanners, getGalleryItems } from "@/services/admin/contentService";
import { getStoreSettings } from "@/services/admin/storefrontService";
import { HeroCarousel } from "@/components/features/layout/molecules/home/HeroCarousel";
import { SloganSection } from "@/components/features/layout/organisms/home/SloganSection";
import { CategorySection } from "@/components/features/layout/organisms/home/CategorySection";
import { KeunggulanSection } from "@/components/features/layout/organisms/home/KeunggulanSection";
import { BestSellerSection } from "@/components/features/layout/organisms/home/BestSellerSection";
import { GallerySection } from "@/components/features/layout/organisms/home/GallerySection";
import { VisitUsSection } from "@/components/features/layout/organisms/home/VisitUsSection";

export default async function Home() {
  const [products, heroBanners, galleryItems, shopInfo] = await Promise.all([
    getProducts(),
    getHeroBanners(),
    getGalleryItems(),
    getStoreSettings(),
  ]);

  // asal dulu aja yang penting jalan dulu, 
  const bestSellers = products.slice(0, 3);

  return (
    <main>
      <HeroCarousel banners={heroBanners} />
      <SloganSection shopInfo={shopInfo} />
      <CategorySection />
      <KeunggulanSection />
      <BestSellerSection products={bestSellers} />
      <GallerySection items={galleryItems} />
      <VisitUsSection shopInfo={shopInfo} />
    </main>
  );
}
