import React from 'react';
import { X, Sparkles, RefreshCw } from 'lucide-react';
import { PaymentWithCustomer } from '@/services/admin/paymentService';
import { formatIdr } from '@/utils/format';
import { getPaymentDetailsText } from '@/utils/paymentFormatters';

interface PaymentDetailModalProps {
  payment: PaymentWithCustomer;
  onClose: () => void;
  onCheckStatus: (payment: PaymentWithCustomer) => void;
}

export const PaymentDetailModal = ({ payment, onClose, onCheckStatus }: PaymentDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 flex flex-col transform transition-all">
        
        {/* Elegant Header with Receipt Aesthetics */}
        <div className="bg-[#4A5D4E] text-white p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <Sparkles size={120} />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-[10px] bg-white/20 text-white font-bold tracking-widest uppercase px-2 py-0.5 rounded">BUKTI MUTASI (MIDTRANS)</span>
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
        <div className="p-6 space-y-4 flex-1">
          <div className="border-b border-dashed border-gray-200 pb-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">ID Transaksi Asal</span>
              <span className="font-bold text-gray-900">{payment.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Nama Pelanggan</span>
              <span className="font-bold text-gray-900">{payment.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Waktu Pembayaran</span>
              <span className="font-medium text-gray-900">{new Date(payment.updatedAt).toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Bank Source Detail Container */}
          <div className="bg-[#FDFBF7] border border-[#4A5D4E]/10 p-4 rounded-xl space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Metode Bayar</span>
              <span className="font-bold text-[#4A5D4E] uppercase">{payment.paymentMethod?.replace('_', ' ') || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Detail / Sumber</span>
              <span className="font-mono font-bold text-gray-900">{getPaymentDetailsText(payment)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200/50 pt-2">
              <span className="text-gray-400">ID Midtrans</span>
              <span className="font-mono text-gray-600 font-bold truncate max-w-[150px]" title={payment.midtransTransactionId || ''}>
                {payment.midtransTransactionId || '-'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Status Pembayaran</span>
            <p className="text-xs text-gray-600 italic bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-semibold uppercase">
              {payment.status}
            </p>
          </div>

          {/* Total Settlement Amount */}
          <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-800">Dana Tagihan</span>
            <span className="text-xl font-bold text-[#4A5D4E]">{formatIdr(Number(payment.amount))}</span>
          </div>
        </div>

        <div className="bg-[#F5F2EB]/50 p-4 flex justify-end gap-3">
          <button 
            onClick={() => onCheckStatus(payment)}
            className="px-5 py-2 bg-white border border-[#4A5D4E]/20 text-[#4A5D4E] rounded-xl text-xs font-semibold hover:bg-[#4A5D4E]/5 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={14} /> Cek Ulang Status
          </button>
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-[#4A5D4E] text-white rounded-xl text-xs font-semibold hover:bg-[#3d4d40] transition-colors"
          >
            Selesai Dibaca
          </button>
        </div>

      </div>
    </div>
  );
};
