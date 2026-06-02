"use client";

import { motion } from "framer-motion";
import type React from "react";
import { CategoryCard } from "../../molecules/category/CategoryCard";
import { fadeInUp } from "../../../constants/animations";
import { CATEGORIES } from "../../../constants/mockData";

const SectionHeading = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <motion.div variants={fadeInUp} className="text-center mb-12 animate-fade-in">
    <h1 className="font-playfair text-4xl md:text-5xl text-[#2C302E] mb-4">
      {title}
    </h1>
    {subtitle && (
      <p className="font-sans text-[#5A635E] max-w-2xl mx-auto">{subtitle}</p>
    )}
  </motion.div>
);

export const CollectionsPageClient: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 bg-[#FAFAF7] min-h-screen"
    >
      <div className="container mx-auto px-6">
        <SectionHeading
          title="Semua Kategori"
          subtitle="Pilih kategori momen spesial Anda."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionsPageClient;
