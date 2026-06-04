import { Metadata } from "next";
import { Suspense } from "react";
import { ProductHeader } from "@/components/features/admin/product/organisms/product/ProductHeader";
import { ProductGrid } from "@/components/features/admin/product/organisms/product/ProductGrid";
import { LoadingSpinner } from "@/components/features/admin/core/atoms/LoadingSpinner";

export const metadata: Metadata = {
  title: "Katalog Produk",
  description: "Manajemen katalog produk toko bunga.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function AdminProductsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const suspenseKey = `${searchParams.q || ""}-${searchParams.category || ""}`;

  return (
    <div className="space-y-6">
      <ProductHeader />
      <Suspense key={suspenseKey} fallback={<LoadingSpinner text="Memuat Produk..." className="py-20" />}>
        <ProductGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
