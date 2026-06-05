import React from 'react';
import { X, Sparkles, RefreshCw, FileText } from 'lucide-react';
import { PaymentWithCustomer } from '@/services/admin/paymentService';
import { formatIdr } from '@/utils/format';
import { getPaymentDetailsText } from '@/utils/paymentFormatters';
import { motion } from 'framer-motion';
import { printInvoice } from '@/utils/printInvoice';

interface PaymentDetailModalProps {
  payment: PaymentWithCustomer;
  onClose: () => void;
  onCheckStatus: (payment: PaymentWithCustomer) => void;
}

export const PaymentDetailModal = ({ payment, onClose, onCheckStatus }: PaymentDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl border border-gray-100 flex flex-col z-10"
      >

        {/* Elegant Header with Receipt Aesthetics */}
        <div className="bg-brand text-white p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <Sparkles size={120} />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-[10px] bg-white/20 text-white font-bold tracking-widest uppercase px-2 py-0.5 rounded-lg">BUKTI MUTASI (MIDTRANS)</span>
              <h3 className="font-serif font-bold text-2xl mt-1">PAY-{payment.id}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-200 mt-2 relative z-10">Magnolia Florist Settlement Gateway</p>
        </div>

        {/* Receipt Details Sheet */}
        <div className="p-6 space-y-4 flex-1 bg-white">
          <div className="border-b border-dashed border-gray-200 pb-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">ID Transaksi Asal</span>
              <span className="font-bold text-gray-900">{payment.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Nama Pelanggan</span>
              <span className="font-bold text-gray-900">{payment.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Waktu Pembayaran</span>
              <span className="font-medium text-gray-900">{(payment.paymentDetails as { paid_at: string })?.paid_at ? new Date((payment.paymentDetails as { paid_at: string })?.paid_at).toLocaleString('id-ID') : "-"}</span>
            </div>
          </div>

          {/* Bank Source Detail Container */}
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Metode Bayar</span>
              <span className="font-bold text-brand uppercase">{payment.paymentMethod?.replace('_', ' ') || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Detail / Sumber</span>
              <span className="font-mono font-bold text-gray-900">{getPaymentDetailsText(payment)}</span>
            </div>
            {/* <div className="flex justify-between border-t border-gray-200/50 pt-2">
              <span className="text-gray-500">ID Midtrans</span>
              <span className="font-mono text-gray-600 font-bold truncate max-w-[150px]" title={payment.midtransTransactionId || ''}>
                {payment.midtransTransactionId || '-'}
              </span>
            </div> */}
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Status Pembayaran</span>
            <p className="text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold uppercase">
              {payment.status}
            </p>
          </div>

          {/* Total Settlement Amount */}
          <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-800">Dana Tagihan</span>
            <span className="text-xl font-bold text-brand">{formatIdr(Number(payment.amount))}</span>
          </div>
        </div>

        <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex flex-wrap justify-end gap-2">
          <button
            onClick={() => printInvoice(payment)}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <FileText size={14} /> Unduh Invoice
          </button>
          <button
            onClick={() => {
              onClose(); // close detail modal first
              onCheckStatus(payment);
            }}
            className="px-4 py-2 bg-brand/10 text-brand rounded-xl text-xs font-semibold hover:bg-brand/20 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={14} /> Cek Ulang Status
          </button>
        </div>

      </motion.div>
    </div>
  );
};
