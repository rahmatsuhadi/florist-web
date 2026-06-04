import React from "react";
import { getPaymentHistory } from "@/services/admin/paymentService";
import {
  TableContainer, TableWrapper, TableHeader, TableHead
} from "@/components/features/admin/core/molecules/table/Table";
import { TablePagination } from "@/components/features/admin/core/molecules/table/TablePagination";
import { PaymentTableClient } from "@/components/features/admin/order/molecules/payment/PaymentTableClient";

interface PaymentTableProps {
  searchParams: {
    q?: string;
    method?: string;
    page?: string;
    limit?: string;
  };
}

export const PaymentTable = async ({ searchParams }: PaymentTableProps) => {
  const query = searchParams.q || "";
  const method = searchParams.method || "Semua";
  const page = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "10", 10);

  const { data: currentPayments, total: totalItems } = await getPaymentHistory({
    q: query,
    method,
    page,
    limit,
  });

  const totalPages = Math.ceil(totalItems / limit);

  return (
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
        <PaymentTableClient payments={currentPayments} />
      </TableWrapper>

      {totalItems > 0 && (
        <TablePagination
          totalPages={totalPages}
          totalItems={totalItems}
          itemName="riwayat"
        />
      )}
    </TableContainer>
  );
};
