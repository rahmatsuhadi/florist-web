"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { fadeInUp } from "../../../constants/animations";
import type { Category } from "../../../constants/mockData";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link href={`/collections/${category.id}`} className="block">
      <motion.div
        variants={fadeInUp}
        whileHover={{ y: -10 }}
        className="group cursor-pointer relative overflow-hidden bg-[#E8D9D2] aspect-[3/4]"
      >
        <Image
          src={category.image}
          alt={category.name}
          fill
          quality={80}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/70 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 p-6 w-full text-center flex flex-col justify-end h-full">
          <h3 className="font-playfair text-2xl text-white drop-shadow-md mb-2 transform transition-transform duration-500 group-hover:-translate-y-2">
            {category.name}
          </h3>
          <p className="font-sans text-sm text-white/0 group-hover:text-white/90 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 line-clamp-3">
            {category.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
