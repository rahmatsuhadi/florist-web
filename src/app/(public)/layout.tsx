import React from "react";
import Toast from "../../components/ui/Toast";
import CartSidebar from "../../components/features/cart/organisms/CartSidebar";
import FloatingWidgets from "../../components/features/chat/organisms/FloatingWidgets";
import Footer from "../../components/features/layout/organisms/Footer";
import Navbar from "../../components/features/layout/organisms/Navbar";
import { AppProvider } from "../../store/AppContext";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
      <FloatingWidgets />
      <CartSidebar />
      <Toast />
    </AppProvider>
  );
}
