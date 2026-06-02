"use client";

import { Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { SHOP_INFO } from "../../../constants/shopInfo";
import { useAppContext } from "../../../store/AppContext";

export const Navbar: React.FC = () => {
  const { cart, setIsCartOpen } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header
      className={`fixed w-full top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Mobile menu icon (Visual only for MVP) */}
          <Menu className="md:hidden text-[#2C302E] cursor-pointer" />
          <nav className="hidden md:flex gap-8 font-sans text-sm tracking-widest uppercase text-[#2C302E]">
            <Link href="/" className="hover:text-[#829E8D] transition-colors">
              Home
            </Link>
            <Link
              href="/collections"
              className="hover:text-[#829E8D] transition-colors"
            >
              Collections
            </Link>
          </nav>
        </div>

        <Link href="/">
          <h1 className="font-playfair text-3xl font-bold text-[#2C302E] cursor-pointer">
            {SHOP_INFO.name}.
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative text-[#2C302E] hover:text-[#829E8D] transition-colors cursor-pointer"
            aria-label="Open cart"
          >
            <ShoppingBag size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#829E8D] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
