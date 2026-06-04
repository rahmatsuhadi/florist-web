"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PaymentWithCustomer, checkPaymentStatus } from "@/services/admin/paymentService";
import { PaymentStatusBadge } from "@/components/features/admin/order/atoms/payment/PaymentStatusBadge";
import { PaymentDetailModal } from "@/components/features/admin/order/molecules/payment/PaymentDetailModal";
import { PaymentConfirmModal } from "@/components/features/admin/order/molecules/payment/PaymentConfirmModal";
import { formatIdr } from "@/utils/format";
import {
  TableBody, TableRow, TableCell
} from "@/components/features/admin/core/molecules/table/Table";
import { FileText } from "lucide-react";

interface PaymentTableClientProps {
  payments: PaymentWithCustomer[];
}

export const PaymentTableClient = ({ payments }: PaymentTableClientProps) => {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithCustomer | null>(null);
  const [checkingPayment, setCheckingPayment] = useState<PaymentWithCustomer | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCheckStatus = () => {
    if (!checkingPayment) return;
    startTransition(async () => {
      try {
        const result = await checkPaymentStatus(checkingPayment.id);
        if (result.success) {
          toast.success(result.message);
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("Terjadi kesalahan jaringan saat mengecek status Midtrans");
      } finally {
        setCheckingPayment(null);
        setSelectedPayment(null);
      }
    });
  };

  return (
    <>
      <TableBody>
        {payments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-16 text-gray-400">
              <FileText size={40} className="mx-auto text-gray-200 mb-2" />
              Belum ada riwayat pelunasan kas masuk yang terekam.
            </TableCell>
          </TableRow>
        ) : (
          payments.map((pay) => (
            <TableRow key={pay.id}>
              <TableCell className="font-bold text-gray-900">PAY-{pay.id}</TableCell>
              <TableCell className="font-semibold text-brand">{pay.orderId}</TableCell>
              <TableCell>
                <p className="font-semibold text-gray-900">{pay.customerName}</p>
                <p className="text-[10px] text-gray-400 font-mono truncate max-w-[120px]" title={pay.midtransTransactionId || ""}>
                  {pay.midtransTransactionId?.split("-")[0] || "Pending"}
                </p>
              </TableCell>
              <TableCell className="font-medium text-gray-700 capitalize">
                {pay.paymentMethod?.replace("_", " ") || "Belum dipilih"}
              </TableCell>
              <TableCell className="text-gray-500 text-xs">
                {new Date(pay.updatedAt).toLocaleString("id-ID")}
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
          isProcessing={isPending}
          onCancel={() => setCheckingPayment(null)}
          onConfirm={handleCheckStatus}
        />
      )}
    </>
  );
};
