import { Metadata } from "next";
import { getPublicOrderById } from "@/services/public/checkoutService";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import { getStoreSettings } from "@/services/admin/storefrontService";
import { OrderStatusBadge } from "@/components/features/order/atoms/OrderStatusBadge";
import { OrderCustomerDetails } from "@/components/features/order/molecules/OrderCustomerDetails";
import { OrderItemsList } from "@/components/features/order/molecules/OrderItemsList";
import { OrderPaymentInfo } from "@/components/features/order/molecules/OrderPaymentInfo";
import { StoreLocationLink } from "@/components/features/order/atoms/StoreLocationLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { getStatusDescription } from "@/utils/orderUtils";

export async function generateMetadata(): Promise<Metadata> {
  const storeSettings = await getStoreSettings();
  const storeName = storeSettings.name || "Florist";

  return {
    title: `Detail Pesanan | ${storeName}`,
    description: "Rincian pesanan Anda",
  };
}

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const orderId = id;

  if (!orderId) {
    return (
      <div className="pt-32 pb-24 bg-[#FAFAF7] min-h-screen">
        <div className="container mx-auto px-6">
          <EmptyState
            title="ID Pesanan Tidak Valid"
            message="Tautan pesanan yang Anda akses tidak valid atau tidak lengkap."
            fullPage={false}
            action={
              <Link href="/track-order" className="inline-block px-6 py-3 bg-[#829E8D] text-white rounded-none hover:bg-[#5A635E] transition-colors">
                Lacak Pesanan Baru
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const order = await getPublicOrderById(orderId);

  if (!order) {
    return (
      <div className="pt-32 pb-24 bg-[#FAFAF7] min-h-screen">
        <div className="container mx-auto px-6">
          <EmptyState
            title="Pesanan Tidak Ditemukan"
            message="Kami tidak dapat menemukan pesanan dengan ID tersebut. Pastikan Anda mengakses URL yang benar."
            fullPage={false}
            action={
              <Link href="/track-order" className="inline-block px-6 py-3 bg-[#829E8D] text-white rounded-none hover:bg-[#5A635E] transition-colors">
                Kembali ke Pencarian
              </Link>
            }
          />
        </div>
      </div>
    );
  }


  return (
    <div className="pt-32 pb-24 bg-[#FAFAF7] min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link href="/track-order" className="inline-flex items-center gap-2 text-[#5A635E] hover:text-[#829E8D] mb-8 font-sans">
          <ChevronLeft size={20} /> Kembali ke Pelacakan
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Kolom Kiri: Detail Pesanan */}
          <div className="flex-1 w-full space-y-6">
            <div className="bg-white border border-[#E8D9D2] p-8 shadow-sm rounded-none">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E8D9D2] pb-6 mb-6">
                <div>
                  <h1 className="font-playfair text-3xl text-[#2C302E] mb-2">Invoice {order.id}</h1>
                  <p className="font-sans text-[#5A635E]">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-3">
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              <div className="bg-[#FAFAF7] border border-[#E8D9D2] p-5 rounded-none mb-8">
                <h4 className="font-playfair text-[#2C302E] font-bold flex items-center gap-2 mb-2 text-lg">
                  <Info size={18} className="text-[#829E8D]" /> Status Pesanan Saat Ini
                </h4>
                <p className="font-sans text-sm text-[#5A635E] leading-relaxed">
                  {getStatusDescription(order.status)}
                </p>
                {order.status === "Siap Diambil" && (
                  <StoreLocationLink />
                )}
              </div>

              <OrderCustomerDetails order={order} />
              
              <OrderItemsList order={order} />
            </div>
          </div>

          {/* Kolom Kanan: Rincian Pembayaran */}
          <div className="w-full lg:w-96 shrink-0">
            <OrderPaymentInfo order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}
