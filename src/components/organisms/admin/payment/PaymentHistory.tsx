"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CreditCard, Clock, FileCheck, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { PaymentWithCustomer, checkPaymentStatus, getPaymentHistory } from '@/services/admin/paymentService';
import { formatIdr } from '@/utils/format';
import { useRouter } from 'next/navigation';

import { PaymentStatusBadge } from '@/components/atoms/admin/payment/PaymentStatusBadge';
import { PaymentStatCard } from '@/components/molecules/admin/payment/PaymentStatCard';
import { PaymentDetailModal } from '@/components/molecules/admin/payment/PaymentDetailModal';
import { PaymentConfirmModal } from '@/components/molecules/admin/payment/PaymentConfirmModal';
import { 
  TableContainer, TableWrapper, TableHeader, TableHead, 
  TableBody, TableRow, TableCell, TablePagination 
} from "@/components/molecules/admin/table/Table";
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/atoms/admin/LoadingSpinner';

export const PaymentHistory = () => {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentWithCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('Semua');
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithCustomer | null>(null);
  const [checkingPayment, setCheckingPayment] = useState<PaymentWithCustomer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPaymentHistory();
        setPayments(data);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, methodFilter]);

  const handleCheckStatus = async () => {
    if (!checkingPayment) return;
    setIsProcessing(true);
    try {
      const result = await checkPaymentStatus(checkingPayment.id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan saat mengecek status Midtrans');
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
    <div className="space-y-6 pb-20">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Riwayat Pelunasan Kas</h1>
          <p className="text-gray-500">Rekam mutasi kas masuk, verifikasi transfer bank, e-wallet, dan status settlement Midtrans.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Order ID / Pelanggan..."
              className="pl-10 pr-4 py-2.5 bg-white border border-brand/20 rounded-xl outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all w-full sm:w-64 shadow-sm"
            />
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoadingSpinner text="Memuat Riwayat..." className="py-20" />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
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
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Semua', 'Transfer Bank', 'E-Wallet', 'Lainnya'].map((type) => (
          <button
            key={type}
            onClick={() => setMethodFilter(type)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              methodFilter === type
                ? 'bg-brand text-white shadow-sm'
                : 'bg-white border border-brand/20 text-gray-600 hover:bg-brand/5'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* MAIN PAYMENT TABLE */}
      <TableContainer>
        <TableWrapper>
          <TableHeader>
            <TableHead>No. Bayar</TableHead>
            <TableHead>ID Order</TableHead>
            <TableHead>Pelanggan</TableHead>
            <TableHead>Metode</TableHead>
            <TableHead>Update Terakhir</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Tindakan</TableHead>
          </TableHeader>
          <TableBody>
              {currentPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-gray-400">
                    <FileText size={40} className="mx-auto text-gray-200 mb-2" />
                    Belum ada riwayat pelunasan kas masuk yang terekam.
                  </TableCell>
                </TableRow>
              ) : (
                currentPayments.map((pay) => (
                  <TableRow key={pay.id}>
                    <TableCell className="font-bold text-gray-900">PAY-{pay.id}</TableCell>
                    <TableCell className="font-semibold text-brand">{pay.orderId}</TableCell>
                    <TableCell>
                      <p className="font-semibold text-gray-900">{pay.customerName}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate max-w-[120px]" title={pay.midtransTransactionId || ''}>
                        {pay.midtransTransactionId?.split('-')[0] || 'Pending'}
                      </p>
                    </TableCell>
                    <TableCell className="font-medium text-gray-700 capitalize">
                      {pay.paymentMethod?.replace('_', ' ') || 'Belum dipilih'}
                    </TableCell>
                    <TableCell className="text-gray-500 text-xs">
                      {new Date(pay.updatedAt).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="font-extrabold text-brand">{formatIdr(Number(pay.amount))}</TableCell>
                    <TableCell className="text-center">
                      <PaymentStatusBadge status={pay.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => setSelectedPayment(pay)}
                        className="text-xs font-semibold text-brand hover:underline"
                      >
                        Detail Struk
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </TableWrapper>
        
        {/* Pagination Controls */}
        {filteredPayments.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredPayments.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(limit) => {
              setItemsPerPage(limit);
              setCurrentPage(1);
            }}
            itemName="riwayat"
          />
        )}
      </TableContainer>

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
      </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};
