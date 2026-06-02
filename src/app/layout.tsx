import type { Metadata } from "next";
import { Lora, Playfair_Display } from "next/font/google";
import "./globals.css";
import Toast from "../components/atoms/Toast";
import CartSidebar from "../components/organisms/cart/CartSidebar";
import FloatingWidgets from "../components/organisms/chat/FloatingWidgets";
import Footer from "../components/organisms/layout/Footer";
import Navbar from "../components/organisms/layout/Navbar";
import { SHOP_INFO } from "../constants/shopInfo";
import { AppProvider } from "../store/AppContext";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${SHOP_INFO.fullName} | Rangkaian Bunga Premium`,
  description:
    "Menghadirkan keindahan alam ke dalam momen berharga Anda dengan rangkaian bunga segar premium. Proses cepat setengah hari selesai dan gratis pengiriman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${lora.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-[#E8D9D2] selection:text-[#2C302E]">
        <AppProvider>
          <Navbar />
          <div className="flex-grow">{children}</div>
          <Footer />
          <FloatingWidgets />
          <CartSidebar />
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
