import { Metadata } from "next";
import { getStoreSettings } from "@/services/admin/storefrontService";
import { getOrdersByPhone } from "@/services/public/checkoutService";
import { TrackOrderForm } from "@/components/features/order/molecules/TrackOrderForm";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatIdr } from "@/utils/format";
import { OrderStatusBadge } from "@/components/features/order/atoms/OrderStatusBadge";

export async function generateMetadata(): Promise<Metadata> {
  const storeSettings = await getStoreSettings();
  const storeName = storeSettings.name || "Florist";

  return {
    title: `Lacak Pesanan | ${storeName}`,
    description: `Lacak status pesanan bunga Anda di ${storeName}`,
  };
}

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ phone?: string }>;
}

export default async function TrackOrderPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const phone = params.phone || "";
  
  let searchResults = null;
  if (phone) {
    searchResults = await getOrdersByPhone(phone);
  }

  return (
    <div className="pt-32 pb-24 bg-[#FAFAF7] min-h-screen">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl text-[#2C302E] mb-4">Lacak Pesanan</h2>
          <p className="font-sans text-[#5A635E] max-w-2xl mx-auto">
            Masukkan nomor WhatsApp yang Anda gunakan saat checkout untuk melihat status pesanan Anda.
          </p>
        </div>
        
        <TrackOrderForm initialPhone={phone} />

        {searchResults && (
          <div className="space-y-6">
            <h3 className="font-playfair text-xl text-[#2C302E] mb-4">
              Hasil Pencarian ({searchResults.length})
            </h3>
            {searchResults.length === 0 ? (
              <div className="bg-white p-8 text-center border border-[#E8D9D2] text-[#5A635E] font-sans">
                Tidak ada pesanan yang ditemukan untuk nomor {phone}.
              </div>
            ) : (
              searchResults.map(order => (
                <Link 
                  href={`/orders/${order.id}`} 
                  key={order.id} 
                  className="bg-white border border-[#E8D9D2] p-6 hover:shadow-md transition-shadow cursor-pointer group flex flex-col sm:flex-row justify-between sm:items-center gap-4 block"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-playfair text-lg font-bold text-[#2C302E]">{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="font-sans text-sm text-[#5A635E]">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                    <p className="font-sans text-sm text-[#5A635E] mt-1">
                      {order.items.length} item • {formatIdr(Number(order.totalAmount))}
                    </p>
                  </div>
                  <div className="text-[#829E8D] group-hover:translate-x-2 transition-transform">
                    <ArrowRight size={24} />
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
