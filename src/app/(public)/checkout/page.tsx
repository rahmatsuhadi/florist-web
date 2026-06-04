import { Metadata } from "next";
import { CheckoutForm } from "@/components/features/checkout/organisms/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | Magnolia Florist",
  description: "Selesaikan pesanan Anda",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-playfair text-3xl text-[#2C302E] mb-8">Checkout</h1>
        <CheckoutForm />
      </div>
    </div>
  );
}
