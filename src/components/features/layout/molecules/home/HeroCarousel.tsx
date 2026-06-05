"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HeroBannerData } from "@/services/admin/contentService";

interface HeroCarouselProps {
  banners: HeroBannerData[];
}

export const HeroCarousel = ({ banners }: HeroCarouselProps) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const activeBanners = banners.filter((b) => b.isActive).sort((a, b) => a.position - b.position);

  useEffect(() => {
    if (activeBanners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const currentBanner = activeBanners.length > 0 ? activeBanners[currentBannerIndex] : null;

  if (!currentBanner) return null;

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black [clip-path:inset(0)]">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentBanner.id || currentBannerIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 w-full h-full"
          >
            <Image
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              fill
              sizes="100vw"
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
            key={currentBanner.id || currentBannerIndex}
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
  );
};
