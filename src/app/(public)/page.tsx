import { getProducts } from "@/services/admin/productService";
import { getHeroBanners, getGalleryItems } from "@/services/admin/contentService";
import HomePageClient from "./HomePageClient";

export default async function Home() {
  const [products, heroBanners, galleryItems] = await Promise.all([
    getProducts(),
    getHeroBanners(),
    getGalleryItems(),
  ]);

  return <HomePageClient initialProducts={products} heroBanners={heroBanners} galleryItems={galleryItems} />;
}
