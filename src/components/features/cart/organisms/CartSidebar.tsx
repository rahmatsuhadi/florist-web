"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/store/AppContext";
import { formatIdr } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const CartSidebar: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, cartTotal, dispatch, setToast, customerInfo, setCustomerInfo } =
    useAppContext();
  const router = useRouter();
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
  });

  const handleContinue = () => {
    const newErrors = {
      name: customerInfo.name.trim() ? "" : "Nama lengkap wajib diisi.",
      phone: customerInfo.phone.trim() ? "" : "Nomor WhatsApp wajib diisi.",
    };

    setErrors(newErrors);

    if (newErrors.name || newErrors.phone) {
      setToast({ message: "Mohon lengkapi nama dan nomor WhatsApp." });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E8D9D2]">
              <h2 className="font-playfair text-2xl text-[#2C302E]">
                Keranjang
              </h2>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="text-[#5A635E] hover:text-red-500 cursor-pointer"
                aria-label="Close sidebar"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items / Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#5A635E]">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p className="font-sans">Keranjang Anda masih kosong.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="flex gap-4 items-center border-b border-gray-50 pb-4"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          quality={80}
                          className="object-cover w-20 h-20"
                        />
                        <div className="flex-1">
                          <h4 className="font-playfair text-[#2C302E] line-clamp-1">
                            {item.name}
                          </h4>
                          {item.variantsText && (
                            <p className="font-sans text-xs text-[#829E8D] mb-1">
                              {item.variantsText}
                            </p>
                          )}
                          {item.notes && (
                            <p className="font-sans text-[10px] text-gray-500 italic bg-gray-50 p-1.5 rounded border border-gray-100 mb-1">
                              Catatan: {item.notes}
                            </p>
                          )}
                          <p className="font-sans text-sm text-[#5A635E]">
                            {formatIdr(item.price)}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                dispatch({
                                  type: "UPDATE_QTY",
                                  payload: {
                                    cartItemId: item.cartItemId,
                                    qty: item.qty - 1,
                                  },
                                })
                              }
                              className="p-1 border border-[#E8D9D2] hover:bg-gray-50 cursor-pointer"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-sans text-sm w-4 text-center">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch({
                                  type: "UPDATE_QTY",
                                  payload: {
                                    cartItemId: item.cartItemId,
                                    qty: item.qty + 1,
                                  },
                                })
                              }
                              className="p-1 border border-[#E8D9D2] hover:bg-gray-50 cursor-pointer"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch({
                              type: "REMOVE_ITEM",
                              payload: { cartItemId: item.cartItemId },
                            })
                          }
                          className="text-gray-400 hover:text-red-500 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Form details */}
                  <div className="border-t border-[#E8D9D2] pt-6 mt-6">
                    <div className="flex justify-between mb-6 font-playfair text-xl text-[#2C302E]">
                      <span>Total</span>
                      <span>{formatIdr(cartTotal)}</span>
                    </div>

                    <h3 className="font-playfair text-lg text-[#2C302E] mb-4">
                      Informasi Pengiriman
                    </h3>
                    <Input
                      label="Nama Lengkap"
                      value={customerInfo.name}
                      onChange={(e) => {
                        setCustomerInfo({
                          ...customerInfo,
                          name: e.target.value,
                        });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      placeholder="Nama lengkap..."
                      error={errors.name}
                    />
                    <Input
                      label="Nomor WhatsApp"
                      value={customerInfo.phone}
                      onChange={(e) => {
                        setCustomerInfo({
                          ...customerInfo,
                          phone: e.target.value,
                        });
                        if (errors.phone) setErrors({ ...errors, phone: "" });
                      }}
                      placeholder="0812..."
                      type="tel"
                      error={errors.phone}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer action button */}
            {cart.length > 0 && (
              <div className="p-6 bg-[#FAFAF7] border-t border-[#E8D9D2]">
                <Button
                  className={`w-full bg-[#2C302E] hover:bg-[#1A1C1B] border-0 text-white`}
                  onClick={handleContinue}
                >
                  Lanjut ke Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
