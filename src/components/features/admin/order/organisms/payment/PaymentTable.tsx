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
      <PaymentTableClient payments={currentPayments} />

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
