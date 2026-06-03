"use client";

import React, { useState, useEffect } from 'react';
import { Search, CreditCard, Clock, FileCheck, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { PaymentWithCustomer, checkPaymentStatus } from '@/services/admin/paymentService';
import { formatIdr } from '@/utils/format';
import { useRouter } from 'next/navigation';

import { PaymentStatusBadge } from '@/components/atoms/admin/payment/PaymentStatusBadge';
import { PaymentStatCard } from '@/components/molecules/admin/payment/PaymentStatCard';
import { PaymentDetailModal } from '@/components/molecules/admin/payment/PaymentDetailModal';
import { PaymentConfirmModal } from '@/components/molecules/admin/payment/PaymentConfirmModal';

export const PaymentHistory = ({ payments }: { payments: PaymentWithCustomer[] }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('Semua');
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithCustomer | null>(null);
  const [checkingPayment, setCheckingPayment] = useState<PaymentWithCustomer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, methodFilter]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMsg({ message, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCheckStatus = async () => {
    if (!checkingPayment) return;
    setIsProcessing(true);
    try {
      const result = await checkPaymentStatus(checkingPayment.id);
      if (result.success) {
        showToast(result.message, 'success');
        router.refresh();
      } else {
        showToast(result.message, 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'Gagal mengecek status', 'error');
    } finally {
      setIsProcessing(false);
      setCheckingPayment(null);
      setSelectedPayment(null); // Close detail modal if open
    }
  };

  const filteredPayments = payments.filter(pay => {
    const payId = `PAY-${pay.id}`;
    const matchesSearch = (pay.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pay.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      payId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod = methodFilter === 'Semua' ||
      (methodFilter === 'Transfer Bank' && pay.paymentMethod === 'bank_transfer') ||
      (methodFilter === 'E-Wallet' && (pay.paymentMethod === 'qris' || pay.paymentMethod === 'gopay' || pay.paymentMethod === 'shopeepay')) ||
      (methodFilter === 'Lainnya' && pay.paymentMethod !== 'bank_transfer' && pay.paymentMethod !== 'qris' && pay.paymentMethod !== 'gopay' && pay.paymentMethod !== 'shopeepay');
    return matchesSearch && matchesMethod;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

  const getTotalAmount = () => {
    return payments
      .filter(p => p.status === 'success' || p.status === 'settlement' || p.status === 'capture')
      .reduce((acc, curr) => acc + parseFloat(curr.amount || '0'), 0);
  };

  return (
    <div className="space-y-6 font-sans relative pb-20">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Riwayat Pelunasan Kas</h1>
          <p className="text-gray-500 font-sans text-sm">Rekam mutasi kas masuk, verifikasi transfer bank, e-wallet, dan status settlement Midtrans.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Order ID / Pelanggan..."
              className="pl-10 pr-4 py-2.5 bg-white border border-[#4A5D4E]/20 rounded-xl outline-none focus:border-[#4A5D4E] focus:ring-1 focus:ring-[#4A5D4E] transition-all w-full sm:w-64 shadow-sm text-sm"
            />
          </div>
        </div>
      </header>

      {/* STAT CARDS ON THE PAYMENT LOG */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <PaymentStatCard 
          title="Total Mutasi Verifikasi" 
          value={formatIdr(getTotalAmount())} 
          icon={FileCheck} 
          colorClass="emerald" 
        />
        <PaymentStatCard 
          title="Jumlah Pelunasan (Sukses)" 
          value={`${payments.filter(p => p.status === 'success' || p.status === 'settlement' || p.status === 'capture').length} Invoice`} 
          icon={CreditCard} 
          colorClass="indigo" 
        />
        <PaymentStatCard 
          title="Total Percobaan Bayar" 
          value={`${payments.length} Upaya`} 
          icon={Clock} 
          colorClass="amber" 
        />
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['Semua', 'Transfer Bank', 'E-Wallet', 'Lainnya'].map((type) => (
          <button
            key={type}
            onClick={() => setMethodFilter(type)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              methodFilter === type
                ? 'bg-[#4A5D4E] text-white shadow-sm'
                : 'bg-white border border-[#4A5D4E]/10 text-gray-500 hover:bg-[#4A5D4E]/5'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* MAIN PAYMENT TABLE */}
      <div className="bg-white rounded-2xl border border-[#4A5D4E]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F5F2EB]/30 text-gray-400 font-semibold uppercase text-xs">
                <th className="px-6 py-4 font-medium">No. Bayar</th>
                <th className="px-6 py-4 font-medium">ID Order</th>
                <th className="px-6 py-4 font-medium">Pelanggan</th>
                <th className="px-6 py-4 font-medium">Metode</th>
                <th className="px-6 py-4 font-medium">Update Terakhir</th>
                <th className="px-6 py-4 font-medium">Nominal</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400">
                    <FileText size={40} className="mx-auto text-gray-200 mb-2" />
                    Belum ada riwayat pelunasan kas masuk yang terekam.
                  </td>
                </tr>
              ) : (
                currentPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#FDFBF7]/40 transition-colors">
                    <td className="px-6 py-4.5 font-bold text-gray-900">PAY-{pay.id}</td>
                    <td className="px-6 py-4.5 font-semibold text-[#4A5D4E]">{pay.orderId}</td>
                    <td className="px-6 py-4.5">
                      <p className="font-semibold text-gray-900">{pay.customerName}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate max-w-[120px]" title={pay.midtransTransactionId || ''}>
                        {pay.midtransTransactionId?.split('-')[0] || 'Pending'}
                      </p>
                    </td>
                    <td className="px-6 py-4.5 font-medium text-gray-700 capitalize">
                      {pay.paymentMethod?.replace('_', ' ') || 'Belum dipilih'}
                    </td>
                    <td className="px-6 py-4.5 text-xs text-gray-400">
                      {new Date(pay.updatedAt).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4.5 font-extrabold text-[#4A5D4E]">{formatIdr(Number(pay.amount))}</td>
                    <td className="px-6 py-4.5 text-center">
                      <PaymentStatusBadge status={pay.status} />
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <button
                        onClick={() => setSelectedPayment(pay)}
                        className="text-xs font-semibold text-[#4A5D4E] hover:underline"
                      >
                        Detail Struk
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Tampilkan</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded-lg text-sm px-2 py-1 outline-none focus:border-[#4A5D4E]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-500">
              dari {filteredPayments.length} riwayat
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white shadow-sm"
            >
              Kembali
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Only show 5 pages around current page for large datasets
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors shadow-sm ${currentPage === page
                        ? "bg-[#4A5D4E] text-white font-medium border border-[#4A5D4E]"
                        : "text-gray-600 hover:bg-gray-100 bg-white border border-gray-200"
                        }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white shadow-sm"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedPayment && (
        <PaymentDetailModal 
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onCheckStatus={(pay) => setCheckingPayment(pay)}
        />
      )}

      {/* CONFIRMATION MODAL */}
      {checkingPayment && (
        <PaymentConfirmModal 
          payment={checkingPayment}
          isProcessing={isProcessing}
          onCancel={() => setCheckingPayment(null)}
          onConfirm={handleCheckStatus}
        />
      )}

      {/* TOAST MESSAGE */}
      {toastMsg && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-sans text-sm font-semibold whitespace-nowrap animate-bounce-in
          ${toastMsg.type === 'success' ? 'bg-[#2C302E] text-[#829E8D]' : 'bg-red-500 text-white'}`}
        >
          {toastMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className={toastMsg.type === 'success' ? 'text-white' : ''}>{toastMsg.message}</span>
        </div>
      )}
    </div>
  );
};
