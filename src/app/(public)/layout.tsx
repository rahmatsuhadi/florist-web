import React from "react";
import Toast from "../../components/ui/Toast";
import CartSidebar from "../../components/features/cart/organisms/CartSidebar";
import FloatingWidgets from "../../components/features/chat/organisms/FloatingWidgets";
import Footer from "../../components/features/layout/organisms/Footer";
import Navbar from "../../components/features/layout/organisms/Navbar";
import { AppProvider } from "../../store/AppContext";
import { getStoreSettings } from "@/services/admin/storefrontService";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeSettings = await getStoreSettings();

  return (
    <AppProvider initialShopInfo={storeSettings}>
      <Navbar shopInfo={storeSettings} />
      <div className="grow">{children}</div>
      <Footer shopInfo={storeSettings} />
      <FloatingWidgets shopInfo={storeSettings} />
      <CartSidebar />
      <Toast />
    </AppProvider>
  );
}
