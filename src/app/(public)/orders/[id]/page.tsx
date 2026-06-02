import { Metadata } from "next";
import { getPublicOrderById } from "@/services/public/checkoutService";
import Link from "next/link";
import { OrderDetailClient } from "./OrderDetailClient";

export const metadata: Metadata = {
  title: "Detail Pesanan | L'Fleur",
  description: "Rincian pesanan Anda",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const orderId = Number(id);

  if (isNaN(orderId)) {
    return <div className="pt-40 pb-20 text-center font-sans">ID Pesanan tidak valid</div>;
  }

  const order = await getPublicOrderById(orderId);

  if (!order) {
    return (
      <div className="pt-40 pb-20 text-center font-sans">
        <h2 className="text-2xl font-bold mb-4">Pesanan Tidak Ditemukan</h2>
        <Link href="/track-order" className="text-[#829E8D] underline">
          Kembali ke Pencarian Pesanan
        </Link>
      </div>
    );
  }

  return <OrderDetailClient initialOrder={order} />;
}
