import { OrderDetails } from "@/components/features/admin/order/organisms/order/OrderDetails";
import { Metadata } from "next";
import { getOrderById } from "@/services/admin/orderService";
import { getStoreSettings } from "@/services/admin/storefrontService";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Detail Pesanan | Admin",
  description: "Rincian pesanan dari pelanggan",
};


interface PageProps {
  params: { id: string };
}

export default async function AdminOrderDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const orderId = id;

  if (!orderId) {
    return <div className="p-8 text-center">ID Pesanan tidak valid</div>;
  }

  const order = await getOrderById(orderId);
  const storeSettings = await getStoreSettings();
  const storeName = storeSettings?.name || "Florist";

  if (!order) {
    return (
      <div className="pt-20 text-center">
        <h2 className="text-xl font-bold">Pesanan Tidak Ditemukan</h2>
        <Link href="/admin/orders" className="mt-4 inline-block text-brand underline">
          Kembali ke Daftar Pesanan
        </Link>
      </div>
    );
  }

  return <OrderDetails initialOrder={order} storeName={storeName} />;
}
