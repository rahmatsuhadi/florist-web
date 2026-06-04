import { Clock, Heart, ShieldCheck, Truck } from "lucide-react";
import { FadeInUpWrapper, StaggerWrapper } from "@/components/ui/MotionWrappers";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const KeunggulanSection = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Kualitas Premium",
      desc: "Bunga segar pilihan terbaik yang dirangkai oleh artisan florist berpengalaman.",
    },
    {
      icon: Clock,
      title: "Proses Setengah Hari",
      desc: "Pemesanan cepat dan efisien. Rangkaian bunga Anda bisa siap dalam waktu singkat.",
    },
    {
      icon: Truck,
      title: "Gratis Pengantaran",
      desc: "Layanan free ongkir dengan pengiriman yang aman sampai ke tangan penerima.",
    },
    {
      icon: Heart,
      title: "Layanan Personal",
      desc: "Kustomisasi buket dan pesan kartu ucapan sesuai dengan gaya dan keinginan Anda.",
    },
  ];

  return (
    <section className="py-24 bg-[#E8D9D2]/30">
      <div className="container mx-auto px-6">
        <SectionHeading
          title="Keunggulan Kami"
          subtitle="Komitmen kami untuk memberikan layanan dan kualitas bunga terbaik bagi Anda."
        />
        <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <FadeInUpWrapper
              key={feature.title}
              className="bg-white p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <feature.icon
                size={40}
                className="mx-auto text-[#829E8D] mb-6"
                strokeWidth={1.5}
              />
              <h3 className="font-playfair text-xl text-[#2C302E] mb-3">
                {feature.title}
              </h3>
              <p className="font-sans text-[#5A635E] text-sm leading-relaxed">
                {feature.desc}
              </p>
            </FadeInUpWrapper>
          ))}
        </StaggerWrapper>
      </div>
    </section>
  );
};
