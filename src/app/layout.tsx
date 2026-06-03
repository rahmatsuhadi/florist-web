import type { Metadata } from "next";
import { Lora, Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { getStoreSettings } from "@/services/admin/storefrontService";
import { StoreInitializer } from "@/components/utilities/StoreInitializer";

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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

import { getSeoSettings } from "@/services/admin/seoService";

export async function generateMetadata(): Promise<Metadata> {
  const [storeSettings, seoData] = await Promise.all([
    getStoreSettings(),
    getSeoSettings("home", true)
  ]);

  return {
    title: {
      default: seoData.title,
      template: `%s | ${storeSettings.fullName}`,
    },
    description: seoData.description,
    keywords: seoData.keywords ? seoData.keywords.split(",").map(k => k.trim()) : [],
    authors: [{ name: storeSettings.name }],
    creator: storeSettings.name,
    publisher: storeSettings.name,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: "https://florist-one.vercel.app",
      title: `${storeSettings.fullName} | Rangkaian Bunga Premium Yogyakarta`,
      description:
        "Toko Bunga Premium Yogyakarta - Rangkaian bunga segar berkualitas tinggi untuk momen wisuda, pernikahan, anniversary, dan duka cita.",
      siteName: storeSettings.fullName,
      images: [
        {
          url: "/images/hero/h1.webp",
          width: 1200,
          height: 630,
          alt: storeSettings.fullName,
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeSettings = await getStoreSettings();
  return (
    <html
      lang="id"
      className={`${lora.variable} ${playfairDisplay.variable} ${inter.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans selection:bg-[#E8D9D2] selection:text-[#2C302E]"
      >
        <StoreInitializer initialData={storeSettings} />
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast: "flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl font-sans text-sm font-semibold whitespace-nowrap",
              success: "bg-[#2C302E] text-[#829E8D] [&_[data-title]]:text-white",
              error: "bg-red-500 text-white [&_[data-title]]:text-white",
              info: "bg-blue-500 text-white [&_[data-title]]:text-white",
              warning: "bg-amber-500 text-white [&_[data-title]]:text-white",
            }
          }}
        />
      </body>
    </html>
  );
}
