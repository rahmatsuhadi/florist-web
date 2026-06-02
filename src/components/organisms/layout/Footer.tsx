"use client";

import { MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { SHOP_INFO } from "../../../constants/shopInfo";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2C302E] text-[#FAFAF7] pt-16 pb-8 border-t border-opacity-20 mt-20">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h2 className="font-playfair text-3xl mb-6">{SHOP_INFO.name}.</h2>
          <p className="font-sans text-sm text-gray-400 max-w-sm">
            Menghadirkan keindahan alam ke dalam momen berharga Anda dengan
            rangkaian bunga segar premium.
          </p>
        </div>
        <div>
          <h3 className="font-playfair text-xl mb-6">Explore</h3>
          <ul className="font-sans text-sm text-gray-400 space-y-3">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/collections"
                className="hover:text-white transition-colors"
              >
                Collections
              </Link>
            </li>
            <li>
              <Link
                href="/#kisah-kami"
                className="hover:text-white transition-colors"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-playfair text-xl mb-6">Contact</h3>
          <ul className="font-sans text-sm text-gray-400 space-y-3">
            <li className="flex items-center gap-3">
              <MapPin size={16} /> {SHOP_INFO.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} /> {SHOP_INFO.phone}
            </li>
            <li className="flex items-center gap-3">
              <a
                href={SHOP_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <title>Instagram</title>
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>{SHOP_INFO.instagram}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center font-sans text-xs text-gray-500 border-t border-gray-700 pt-8">
        &copy; {new Date().getFullYear()} {SHOP_INFO.fullName}. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
