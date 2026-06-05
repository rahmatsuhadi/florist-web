"use client";

import { Menu, ShoppingBag, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import type React from "react";
import { useEffect, useState } from "react";
import { useAppContext, CartItem } from "@/store/AppContext";
import type { StoreSettingsData } from "@/services/admin/storefrontService";

export const Navbar: React.FC<{ shopInfo?: StoreSettingsData }> = ({ shopInfo }) => {
  const { cart, setIsCartOpen } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll(); // Check scroll position immediately on page load/refresh
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Calculate total items
  const totalItems = cart.reduce((acc: number, item: CartItem) => acc + item.qty, 0);
  const isHome = pathname === "/";
  const showScrolledStyle = !isHome || isScrolled;

  return (
    <>
      <header
        className={`fixed w-full top-0 z-40 transition-all duration-300 ${
          showScrolledStyle
            ? "bg-white/95 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Mobile menu icon */}
            <button 
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center"
              aria-label="Open mobile menu"
            >
              <Menu
                className={`cursor-pointer transition-colors duration-300 ${
                  showScrolledStyle ? "text-[#2C302E]" : "text-white"
                }`}
              />
            </button>
            
            <nav
              className={`hidden md:flex gap-8 font-sans text-sm tracking-widest uppercase transition-colors duration-300 ${
                showScrolledStyle ? "text-[#2C302E]" : "text-white"
              }`}
            >
              <Link
                href="/"
                className={`transition-colors ${
                  showScrolledStyle
                    ? "hover:text-[#829E8D]"
                    : "hover:text-[#E8D9D2]"
                }`}
              >
                Home
              </Link>
              <Link
                href="/collections"
                className={`transition-colors ${
                  showScrolledStyle
                    ? "hover:text-[#829E8D]"
                    : "hover:text-[#E8D9D2]"
                }`}
              >
                Collections
              </Link>
              <Link
                href="/track-order"
                className={`flex items-center gap-1 transition-colors ${
                  showScrolledStyle
                    ? "hover:text-[#829E8D]"
                    : "hover:text-[#E8D9D2]"
                }`}
              >
                <Search size={14} /> Lacak Pesanan
              </Link>
            </nav>
          </div>

          <Link href="/">
            <Logo
              shopInfo={shopInfo}
              iconClassName={
                showScrolledStyle ? "text-[#829E8D]" : "text-[#E8D9D2]"
              }
              textClassName={showScrolledStyle ? "text-[#2C302E]" : "text-white"}
            />
          </Link>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className={`relative transition-colors duration-300 cursor-pointer ${
                showScrolledStyle
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

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-50 transition-transform duration-300 md:hidden flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-100">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <Logo
              shopInfo={shopInfo}
              iconClassName="text-[#829E8D]"
              textClassName="text-[#2C302E]"
            />
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close mobile menu"
            className="flex items-center justify-center"
          >
            <X className="cursor-pointer text-[#2C302E]" size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-6 p-6 font-sans text-lg tracking-widest uppercase text-[#2C302E]">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-[#829E8D] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/collections"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-[#829E8D] transition-colors"
          >
            Collections
          </Link>
          <Link
            href="/track-order"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 hover:text-[#829E8D] transition-colors"
          >
            <Search size={18} /> Lacak Pesanan
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
