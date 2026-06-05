"use client";

import React, { useState } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import { OrderWithItems } from "@/services/admin/orderService";
import { generateWhatsAppMessage } from "@/utils/orderUtils";
import { motion, AnimatePresence } from "framer-motion";

export const OrderWhatsAppPanel = ({ transaction, status, storeName }: { transaction: OrderWithItems, status: string, storeName: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const cleanPhone = transaction.customerPhone.replace(/[^0-9]/g, "");
  
  const handleOpenModal = () => {
    // Decode the message so it can be edited nicely in a textarea
    const rawMessage = decodeURIComponent(generateWhatsAppMessage(transaction, status, storeName));
    setMessage(rawMessage);
    setIsModalOpen(true);
  };

  const handleSendMessage = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank", "noopener,noreferrer");
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-5">
        <div className="border-b pb-3">
          <h3 className="font-serif text-lg font-semibold text-gray-900">Alur Tanggapan WhatsApp</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-gray-900">Kirim Update Status via WhatsApp</h4>
            <p className="text-xs text-gray-400">Tinjau dan sesuaikan pesan konfirmasi otomatis sebelum dikirim ke pembeli.</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-hover text-white text-sm font-bold rounded-xl transition-all shadow-md shrink-0 w-full sm:w-auto justify-center"
          >
            <MessageCircle size={16} /> Pratinjau Pesan
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl border border-gray-100 flex flex-col z-10"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                <div>
                  <h3 className="font-serif font-semibold text-lg text-gray-900">Pratinjau Pesan WhatsApp</h3>
                  <p className="text-xs text-gray-500 font-sans mt-0.5">Edit pesan ini sebelum mengirim ke {transaction.customerName}</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-48 p-4 text-sm text-gray-700 font-sans leading-relaxed border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand resize-none bg-gray-50/30"
                  placeholder="Ketik pesan WhatsApp di sini..."
                />
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-5 py-2 inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white text-sm font-bold rounded-xl transition-all shadow-md"
                >
                  <Send size={16} /> Kirim Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
