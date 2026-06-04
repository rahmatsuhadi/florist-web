"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { PRODUCTS, Product } from "@/constants/mockData";
import { type Message, sendMessageToGemini } from "@/services/aiService";
import { formatIdr } from "@/utils/format";
import { useShopStore } from "@/store/shopStore";

export const FloatingWidgets: React.FC = () => {
  const router = useRouter();
  const shopName = useShopStore((s) => s.name);
  const shopPhoneWa = useShopStore((s) => s.phoneWa);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: `Halo! Saya asisten AI ${shopName || "L'Fleur Mattz"}. ✨\nAda yang bisa saya bantu untuk menemukan rangkaian bunga yang sempurna untuk momen Anda?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages or open state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleWA = () => {
    window.open(
      `https://wa.me/${shopPhoneWa}?text=Halo%20${encodeURIComponent(shopName || "L'Fleur Mattz")},%20saya%20butuh%20bantuan%20customer%20service.`,
      "_blank",
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    const newMessages: Message[] = [
      ...messages,
      { role: "user", text: userText },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToGemini(newMessages);
      setMessages((prev) => [...prev, { role: "model", text: aiResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse message text to extract product placeholders [PRODUCT:id]
  const renderMessageText = (msg: Message) => {
    if (msg.role === "user") {
      return (
        <div className="bg-[#829E8D] text-white p-3 rounded-2xl rounded-tr-none text-sm font-sans max-w-[85%] self-end shadow-sm">
          {msg.text}
        </div>
      );
    }

    const parts = msg.text.split(/(\[PRODUCT:[a-zA-Z0-9]+\])/);
    return (
      <div className="bg-[#E8D9D2]/30 text-[#2C302E] p-3 rounded-2xl rounded-tl-none text-sm font-sans max-w-[90%] self-start border border-[#E8D9D2] shadow-sm">
        {parts.map((part: string, idx: number) => {
          const match = part.match(/\[PRODUCT:([a-zA-Z0-9]+)\]/);
          const partKey = `part-${idx}-${part.substring(0, 10)}`;
          if (match) {
            const product = PRODUCTS.find((p: Product) => p.id === match[1]);
            if (product) {
              return (
                <button
                  type="button"
                  key={partKey}
                  onClick={() => {
                    router.push(`/products/${product.id}`);
                    setIsChatOpen(false);
                  }}
                  className="mt-3 mb-2 p-2 bg-white rounded-lg border border-[#E8D9D2] hover:border-[#829E8D] cursor-pointer flex gap-3 items-center transition-all duration-300 shadow-sm group text-left w-full"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={56}
                    height={56}
                    quality={80}
                    className="object-cover rounded-md group-hover:scale-105 transition-transform w-14 h-14"
                  />
                  <div className="flex-1">
                    <div className="font-playfair text-[#2C302E] font-semibold leading-tight text-sm line-clamp-1">
                      {product.name}
                    </div>
                    <div className="text-[#829E8D] font-medium text-xs mt-1">
                      {formatIdr(product.price)}
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-[#5A635E] group-hover:text-[#829E8D] transition-colors"
                  />
                </button>
              );
            }
          }
          return (
            <span key={partKey} className="whitespace-pre-wrap">
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      {/* AI Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white shadow-2xl rounded-2xl overflow-hidden w-[350px] sm:w-[380px] h-[500px] flex flex-col border border-[#E8D9D2] origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-[#829E8D] p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Image
                  src={"/images/bot.png"}
                  width={40}
                  height={40}
                  alt="AI Assistant"
                  className="rounded-full"
                />
                <span className="font-playfair text-lg font-medium">
                  {shopName || "L'Fleur Mattz"} AI Assistant
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#FAFAF7]">
              {messages.map((msg, i) => {
                const msgKey = `msg-${i}-${msg.text.substring(0, 15)}`;
                return (
                  <div key={msgKey} className="flex flex-col">
                    {renderMessageText(msg)}
                  </div>
                );
              })}
              {isLoading && (
                <div className="text-[#5A635E] text-xs font-sans self-start bg-[#E8D9D2]/30 px-3 py-2 rounded-2xl rounded-tl-none border border-[#E8D9D2] animate-pulse">
                  AI sedang mengetik...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-[#E8D9D2] bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya rekomendasi bunga..."
                className="flex-1 bg-[#FAFAF7] border border-[#E8D9D2] rounded-full px-4 py-2 text-sm font-sans focus:outline-none focus:border-[#829E8D] transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-[#829E8D] text-white p-2 rounded-full hover:bg-[#6c8575] disabled:opacity-50 transition-colors cursor-pointer"
                aria-label="Send message"
              >
                <Send size={18} className="translate-x-[1px]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Menu Buttons */}
      <AnimatePresence>
        {isMenuOpen && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col gap-3 mb-2"
          >
            <button
              type="button"
              onClick={handleWA}
              className="flex items-center gap-3 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-sans text-sm font-medium cursor-pointer"
            >
              <Phone size={18} /> CS WhatsApp
            </button>
            <button
              type="button"
              onClick={() => {
                setIsChatOpen(true);
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 bg-white text-[#2C302E] border border-[#E8D9D2] px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-sans text-sm font-medium group cursor-pointer"
            >
              <Sparkles
                size={18}
                className="text-[#829E8D] group-hover:animate-pulse"
              />{" "}
              Tanya Asisten Kami
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle FAB */}
      {!isChatOpen && (
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
            isMenuOpen
              ? "bg-[#2C302E] text-white rotate-90"
              : "bg-[#829E8D] text-white hover:bg-[#6c8575] hover:scale-105"
          }`}
          aria-label="Toggle contact menu"
        >
          {isMenuOpen ? (
            <X size={24} className="-rotate-90" />
          ) : (
            <MessageCircle size={26} />
          )}
        </button>
      )}
    </div>
  );
};

export default FloatingWidgets;
