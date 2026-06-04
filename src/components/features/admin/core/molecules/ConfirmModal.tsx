"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Hapus",
  cancelText = "Batal",
  isDestructive = true,
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#2C302E]/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-6"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl border border-[#E8D9D2]">
              <div className="flex items-start justify-between border-b border-[#E8D9D2] px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${isDestructive ? 'bg-red-50 text-red-600' : 'bg-brand/10 text-brand'}`}>
                    <AlertCircle size={20} />
                  </div>
                  <h3 className="font-playfair text-xl font-medium text-[#2C302E]">
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="px-6 py-6 font-sans text-gray-600 leading-relaxed">
                {message}
              </div>
              <div className="flex items-center justify-end gap-3 bg-gray-50/50 px-6 py-4 border-t border-[#E8D9D2]">
                <Button variant="outline" onClick={onClose} className="border-[#E8D9D2]">
                  {cancelText}
                </Button>
                <Button 
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={isDestructive ? 'bg-red-600 hover:bg-red-700 text-white border-0' : ''}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
