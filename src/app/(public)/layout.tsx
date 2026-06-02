import React from "react";
import Toast from "../../components/atoms/Toast";
import CartSidebar from "../../components/organisms/cart/CartSidebar";
import FloatingWidgets from "../../components/organisms/chat/FloatingWidgets";
import Footer from "../../components/organisms/layout/Footer";
import Navbar from "../../components/organisms/layout/Navbar";
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
