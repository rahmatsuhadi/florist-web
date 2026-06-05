import { FadeInWrapper } from "@/components/ui/MotionWrappers";
import { StoreSettingsData } from "@/services/admin/storefrontService";

export const SloganSection = ({ shopInfo }: { shopInfo: StoreSettingsData }) => {
  return (
    <section className="py-20 bg-[#829E8D] text-white text-center">
      <div className="container mx-auto px-6 max-w-4xl">
        <FadeInWrapper>
          <h2 className="font-playfair text-3xl md:text-4xl mb-6 leading-snug">
            {shopInfo.name || "L'Fleur Mattz Florist"}, sampaikan ucapan dengan mudah, cantik, dan tepat waktu.
          </h2>
        </FadeInWrapper>
        <FadeInWrapper>
          <p className="font-sans text-lg text-[#E8D9D2] leading-relaxed">
            Kami hadir untuk mewujudkan pesan bermakna melalui karangan bunga
            premium. Bikin karangan bunga impian Anda{" "}
            <strong>hanya dalam setengah hari bisa jadi</strong>, dilengkapi
            dengan layanan <strong>Gratis Pengantaran (Free Ongkir)</strong>.
          </p>
        </FadeInWrapper>
      </div>
    </section>
  );
};
