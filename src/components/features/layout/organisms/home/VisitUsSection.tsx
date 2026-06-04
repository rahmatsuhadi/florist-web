import { MapPin } from "lucide-react";
import { FadeInUpWrapper } from "@/components/ui/MotionWrappers";
import { StoreSettingsData } from "@/services/admin/storefrontService";

import { LazyStoreMap } from "@/components/features/layout/molecules/home/LazyStoreMap";

export const VisitUsSection = ({ shopInfo }: { shopInfo: StoreSettingsData }) => {
  return (
    <section id="kisah-kami" className="py-24 bg-white border-t border-[#E8D9D2]">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-16">
        <FadeInUpWrapper className="flex-1">
          <h2 className="font-playfair text-4xl text-[#2C302E] mb-6">
            Kisah Kami
          </h2>
          <p className="font-sans text-[#5A635E] mb-6 leading-relaxed">
            Berawal dari kecintaan terhadap keindahan alam, {shopInfo.name}{" "}
            hadir untuk menerjemahkan perasaan melalui bahasa bunga. Setiap
            tangkai dipilih dengan standar kualitas tertinggi, dirangkai
            dengan penuh passion oleh florist bersertifikat kami.
          </p>
          <p className="font-sans text-[#5A635E] leading-relaxed">
            Bagi kami, bunga bukanlah sekadar hiasan, melainkan pembawa pesan
            emosi yang tak tersampaikan oleh kata-kata. Jadikan kami bagian
            dari momen berharga Anda.
          </p>
        </FadeInUpWrapper>
        <FadeInUpWrapper className="flex-1 bg-[#FAFAF7] p-8 rounded-sm">
          <h2 className="font-playfair text-2xl text-[#2C302E] mb-6">
            Kunjungi Studio Kami
          </h2>
          <div className="aspect-video mb-6 w-full overflow-hidden">
            <LazyStoreMap />
          </div>
          <p className="font-sans text-[#5A635E] flex items-center gap-2">
            <MapPin size={18} /> {shopInfo.address} ({shopInfo.openingHours})
          </p>
        </FadeInUpWrapper>
      </div>
    </section>
  );
};
