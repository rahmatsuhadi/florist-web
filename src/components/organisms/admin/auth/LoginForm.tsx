"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { login } from "@/services/admin/authService";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await login(email, password);
      if (response.success) {
        // Redirect to admin dashboard
        router.push("/admin");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-6 relative overflow-hidden font-inter">
      {/* Dekorasi Background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#4A5D4E] opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#B76E79] opacity-5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl border border-[#4A5D4E]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-[#4A5D4E] mb-2">
            Fleuriste
          </h1>
          <p className="text-sm text-gray-500 font-sans">Admin Workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email/Username
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4A5D4E] focus:ring-1 focus:ring-[#4A5D4E] outline-none transition-all bg-white/50"
              placeholder="admin@fleuriste.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4A5D4E] focus:ring-1 focus:ring-[#4A5D4E] outline-none transition-all bg-white/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#4A5D4E] text-white rounded-xl font-medium hover:bg-[#3d4d40] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              "Masuk ke Dashboard"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
