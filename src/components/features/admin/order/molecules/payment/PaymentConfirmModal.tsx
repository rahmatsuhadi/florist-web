import React from 'react';
import { RefreshCw } from 'lucide-react';
import { PaymentWithCustomer } from '@/services/admin/paymentService';
import { motion } from 'framer-motion';

interface PaymentConfirmModalProps {
  payment: PaymentWithCustomer;
  isProcessing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const PaymentConfirmModal = ({ payment, isProcessing, onCancel, onConfirm }: PaymentConfirmModalProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={!isProcessing ? onCancel : undefined}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-6 text-center border border-gray-100 z-10"
      >
        <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw size={32} className={isProcessing ? "animate-spin" : ""} />
        </div>
        <div>
          <h3 className="font-semibold text-xl text-gray-900 mb-2">Cek Ulang Status?</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Sistem akan menyinkronisasi ulang status pembayaran <span className="font-bold text-gray-900">PAY-{payment.id}</span> ke Midtrans. Lanjutkan?
          </p>
        </div>
        <div className="flex gap-3">
          <button
            disabled={isProcessing}
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            disabled={isProcessing}
            onClick={onConfirm}
            className="flex-1 py-3 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isProcessing ? "Mengecek..." : "Sinkronkan"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
