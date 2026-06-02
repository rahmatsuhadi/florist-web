"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock, Heart, MapPin, ShieldCheck, Truck } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fadeInUp, staggerContainer } from "@/constants/animations";
import { CATEGORIES, GALLERY_ITEMS, HERO_BANNERS } from "@/constants/mockData";
import { Button } from "@/components/atoms/Button";
import { SHOP_INFO } from "@/constants/shopInfo";
import CategoryCard from "@/components/molecules/category/CategoryCard";
import ProductCard from "@/components/molecules/product/ProductCard";
import { Product } from "@/services/admin/productService";

const StoreMap = dynamic(() => import("@/components/molecules/map/StoreMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-gray-100 text-sm font-sans text-[#5A635E] border border-[#E8D9D2]">
      Memuat Peta...
    </div>
  ),
});

const SectionHeading = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <motion.div variants={fadeInUp} className="text-center mb-12">
    <h2 className="font-playfair text-4xl md:text-5xl text-[#2C302E] mb-4">
      {title}
    </h2>
    {subtitle && (
      <p className="font-sans text-[#5A635E] max-w-2xl mx-auto">{subtitle}</p>
    )}
  </motion.div>
);

export default function HomePageClient({ initialProducts }: { initialProducts: Product[] }) {
  const bestSellers = initialProducts.slice(0, 3);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentBanner = HERO_BANNERS[currentBannerIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black [clip-path:inset(0)]">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentBanner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="fixed inset-0 w-full h-full"
            >
              <Image
                src={currentBanner.image}
                alt={currentBanner.title}
                fill
                priority
                quality={90}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <h1 className="font-playfair text-5xl md:text-7xl mb-6 drop-shadow-lg leading-tight">
                {currentBanner.title}
              </h1>
              <p className="font-sans text-lg md:text-xl mb-10 max-w-2xl mx-auto drop-shadow-md leading-relaxed text-gray-200">
                {currentBanner.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/collections">
              <Button className="text-lg px-8 py-4 border-0">
                Pesan Sekarang
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Slogan & Business Intro Section */}
      <section className="py-20 bg-[#829E8D] text-white text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-3xl md:text-4xl mb-6 leading-snug"
          >
            {SHOP_INFO.fullName}, sampaikan ucapan dengan mudah, cantik, dan
            tepat waktu.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-lg text-[#E8D9D2] leading-relaxed"
          >
            Kami hadir untuk mewujudkan pesan bermakna melalui karangan bunga
            premium. Bikin karangan bunga impian Anda{" "}
            <strong>hanya dalam setengah hari bisa jadi</strong>, dilengkapi
            dengan layanan <strong>Gratis Pengantaran (Free Ongkir)</strong>.
          </motion.p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-[#FAFAF7]">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Koleksi Kami"
            subtitle="Temukan keindahan yang dirangkai khusus untuk setiap momen spesial."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Keunggulan Kami Section */}
      <section className="py-24 bg-[#E8D9D2]/30">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Keunggulan Kami"
            subtitle="Komitmen kami untuk memberikan layanan dan kualitas bunga terbaik bagi Anda."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
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
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Favorit Pelanggan"
            subtitle="Karya masterpiece yang paling dicintai oleh pelanggan kami."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Aesthetic Gallery (Masonry) */}
      <section className="py-24 bg-[#FAFAF7]">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Galeri Inspirasi"
            subtitle="Potret keindahan hasil kreasi florist profesional kami."
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-[repeat(3,_200px)] gap-4 max-w-6xl mx-auto w-full"
          >
            {GALLERY_ITEMS.map((item) => (
              <div
                key={item.id}
                className={`relative overflow-hidden group rounded-sm shadow-sm bg-gray-200 aspect-[4/3] md:aspect-auto ${item.gridClass}`}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  quality={80}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About & Contact */}
      <section
        id="kisah-kami"
        className="py-24 bg-white border-t border-[#E8D9D2]"
      >
        <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-16">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="font-playfair text-4xl text-[#2C302E] mb-6">
              Kisah Kami
            </h2>
            <p className="font-sans text-[#5A635E] mb-6 leading-relaxed">
              Berawal dari kecintaan terhadap keindahan alam, {SHOP_INFO.name}{" "}
              hadir untuk menerjemahkan perasaan melalui bahasa bunga. Setiap
              tangkai dipilih dengan standar kualitas tertinggi, dirangkai
              dengan penuh passion oleh florist bersertifikat kami.
            </p>
            <p className="font-sans text-[#5A635E] leading-relaxed">
              Bagi kami, bunga bukanlah sekadar hiasan, melainkan pembawa pesan
              emosi yang tak tersampaikan oleh kata-kata. Jadikan kami bagian
              dari momen berharga Anda.
            </p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 bg-[#FAFAF7] p-8 rounded-sm"
          >
            <h2 className="font-playfair text-2xl text-[#2C302E] mb-6">
              Kunjungi Studio Kami
            </h2>
            <div className="aspect-video mb-6 w-full overflow-hidden">
              <StoreMap />
            </div>
            <p className="font-sans text-[#5A635E] flex items-center gap-2">
              <MapPin size={18} /> {SHOP_INFO.address} ({SHOP_INFO.openingHours}
              )
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
