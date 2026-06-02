"use client";

import { Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../../atoms/Logo";
import type React from "react";
import { useEffect, useState } from "react";
import { SHOP_INFO } from "../../../constants/shopInfo";
import { useAppContext } from "../../../store/AppContext";

export const Navbar: React.FC = () => {
  const { cart, setIsCartOpen } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll(); // Check scroll position immediately on page load/refresh
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const isHome = pathname === "/";
  const showScrolledStyle = !isHome || isScrolled;

  return (
    <header
      className={`fixed w-full top-0 z-40 transition-all duration-300 ${showScrolledStyle
          ? "bg-white/95 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Mobile menu icon (Visual only for MVP) */}
          <Menu
            className={`md:hidden cursor-pointer transition-colors duration-300 ${showScrolledStyle ? "text-[#2C302E]" : "text-white"
              }`}
          />
          <nav
            className={`hidden md:flex gap-8 font-sans text-sm tracking-widest uppercase transition-colors duration-300 ${showScrolledStyle ? "text-[#2C302E]" : "text-white"
              }`}
          >
            <Link
              href="/"
              className={`transition-colors ${showScrolledStyle
                  ? "hover:text-[#829E8D]"
                  : "hover:text-[#E8D9D2]"
                }`}
            >
              Home
            </Link>
            <Link
              href="/collections"
              className={`transition-colors ${showScrolledStyle
                  ? "hover:text-[#829E8D]"
                  : "hover:text-[#E8D9D2]"
                }`}
            >
              Collections
            </Link>
          </nav>
        </div>

        <Link href="/">
          <Logo
            iconClassName={showScrolledStyle ? "text-[#829E8D]" : "text-[#E8D9D2]"}
            textClassName={showScrolledStyle ? "text-[#2C302E]" : "text-white"}
          />
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className={`relative transition-colors duration-300 cursor-pointer ${showScrolledStyle
                ? "text-[#2C302E] hover:text-[#829E8D]"
                : "text-white hover:text-[#E8D9D2]"
              }`}
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
