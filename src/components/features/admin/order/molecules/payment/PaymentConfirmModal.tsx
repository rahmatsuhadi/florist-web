import React from 'react';
import { RefreshCw } from 'lucide-react';
import { PaymentWithCustomer } from '@/services/admin/paymentService';

interface PaymentConfirmModalProps {
  payment: PaymentWithCustomer;
  isProcessing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const PaymentConfirmModal = ({ payment, isProcessing, onCancel, onConfirm }: PaymentConfirmModalProps) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-6 text-center border border-brand/10">
        <div className="w-16 h-16 bg-brand-light text-brand rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw size={32} className={isProcessing ? "animate-spin" : ""} />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Cek Ulang Status?</h3>
          <p className="text-sm text-gray-500">
            Sistem akan menyinkronisasi ulang status pembayaran <span className="font-bold text-gray-900">PAY-{payment.id}</span> ke Midtrans. Lanjutkan?
          </p>
        </div>
        <div className="flex gap-3">
          <button
            disabled={isProcessing}
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            disabled={isProcessing}
            onClick={onConfirm}
            className="flex-1 py-3 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? "Mengecek..." : "Ya, Sinkronkan"}
          </button>
        </div>
      </div>
    </div>
  );
};
