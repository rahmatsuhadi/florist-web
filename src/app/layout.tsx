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
  title: {
    default: `${SHOP_INFO.fullName} | Rangkaian Bunga Premium Yogyakarta`,
    template: `%s | ${SHOP_INFO.fullName}`,
  },
  description:
    "Toko Bunga Premium Yogyakarta - Menghadirkan keindahan alam ke dalam buket bunga wisuda, pernikahan, anniversary, dan ucapan belasungkawa. Proses cepat, gratis pengiriman, dan pelayanan ramah.",
  keywords: [
    "toko bunga yogyakarta",
    "florist jogja",
    "buket bunga wisuda",
    "bunga pernikahan jogja",
    "hand bouquet premium",
    "florist bantul",
    "bunga papan yogyakarta",
    "l fleur florist",
    "l fleur mattz",
  ],
  authors: [{ name: "L'Fleur Mattz" }],
  creator: "L'Fleur Mattz",
  publisher: "L'Fleur Mattz",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://lfleurmattz.com",
    title: `${SHOP_INFO.fullName} | Rangkaian Bunga Premium Yogyakarta`,
    description:
      "Toko Bunga Premium Yogyakarta - Rangkaian bunga segar berkualitas tinggi untuk momen wisuda, pernikahan, anniversary, dan duka cita.",
    siteName: SHOP_INFO.fullName,
    images: [
      {
        url: "/images/hero/h1.webp",
        width: 1200,
        height: 630,
        alt: SHOP_INFO.fullName,
      },
    ],
  },
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
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans selection:bg-[#E8D9D2] selection:text-[#2C302E]"
      >
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
