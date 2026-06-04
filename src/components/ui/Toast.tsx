"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type React from "react";
import { useAppContext } from "../../store/AppContext";

export const Toast: React.FC = () => {
  const { toast } = useAppContext();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2C302E] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-sans text-sm whitespace-nowrap"
        >
          <CheckCircle size={18} className="text-[#829E8D]" />
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
