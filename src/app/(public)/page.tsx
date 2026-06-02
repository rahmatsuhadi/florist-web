import { getProducts } from "@/services/admin/productService";
import HomePageClient from "./HomePageClient";

export default async function Home() {
  const products = await getProducts();
  return <HomePageClient initialProducts={products} />;
}
