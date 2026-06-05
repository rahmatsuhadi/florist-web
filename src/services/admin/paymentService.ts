"use server";

import { db } from "@/db";
import { payments, orders } from "@/db/schema";
import { desc, eq, like, or, and, sql, SQL, count } from "drizzle-orm";

export type PaymentWithCustomer = typeof payments.$inferSelect & {
  customerName: string;
};

interface GetPaymentHistoryParams {
  q?: string;
  method?: string;
  page?: number;
  limit?: number;
}

export async function getPaymentHistory(
  params: GetPaymentHistoryParams = {}
): Promise<{ data: PaymentWithCustomer[]; total: number }> {
  const { q = "", method = "Semua", page = 1, limit = 10 } = params;

  try {
    // Build dynamic WHERE conditions
    const conditions: SQL[] = [];

    // Search filter (order ID, customer name, or PAY-id)
    if (q) {
      const searchTerm = `%${q}%`;
      conditions.push(
        or(
          like(payments.orderId, searchTerm),
          like(orders.customerName, searchTerm),
          like(sql`CAST(${payments.id} AS TEXT)`, searchTerm)
        )!
      );
    }

    // Payment method filter
    if (method && method !== "Semua") {
      if (method === "Transfer Bank") {
        conditions.push(eq(payments.paymentMethod, "bank_transfer"));
      } else if (method === "E-Wallet") {
        conditions.push(
          or(
            eq(payments.paymentMethod, "qris"),
            eq(payments.paymentMethod, "gopay"),
            eq(payments.paymentMethod, "shopeepay")
          )!
        );
      } else if (method === "Lainnya") {
        conditions.push(
          and(
            sql`${payments.paymentMethod} != 'bank_transfer'`,
            sql`${payments.paymentMethod} != 'qris'`,
            sql`${payments.paymentMethod} != 'gopay'`,
            sql`${payments.paymentMethod} != 'shopeepay'`
          )!
        );
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count for pagination
    const [totalResult] = await db
      .select({ value: count() })
      .from(payments)
      .leftJoin(orders, eq(payments.orderId, orders.id))
      .where(whereClause);

    const total = totalResult?.value || 0;

    // Get paginated results
    const offset = (page - 1) * limit;
    const results = await db
      .select({
        payment: payments,
        customerName: orders.customerName,
      })
      .from(payments)
      .leftJoin(orders, eq(payments.orderId, orders.id))
      .where(whereClause)
      .orderBy(desc(payments.createdAt))
      .limit(limit)
      .offset(offset);

    const data = results.map((row) => ({
      ...row.payment,
      customerName: row.customerName || "Pelanggan Umum",
    }));

    return { data, total };
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw new Error("Gagal mengambil data riwayat pembayaran");
  }
}

export interface PaymentStatsResult {
  totalVerifiedAmount: number;
  successCount: number;
  totalAttempts: number;
}

export async function getPaymentStats(): Promise<PaymentStatsResult> {
  try {
    const allPayments = await db.select({
      amount: payments.amount,
      status: payments.status,
    }).from(payments);

    const successStatuses = ["success", "settlement", "capture"];

    const successPayments = allPayments.filter((p) =>
      successStatuses.includes(p.status)
    );

    return {
      totalVerifiedAmount: successPayments.reduce(
        (acc, curr) => acc + parseFloat(curr.amount || "0"),
        0
      ),
      successCount: successPayments.length,
      totalAttempts: allPayments.length,
    };
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    return { totalVerifiedAmount: 0, successCount: 0, totalAttempts: 0 };
  }
}

export async function checkPaymentStatus(paymentId: number) {
  try {
    const { coreApi } = await import("@/lib/midtrans");

    const [paymentRecord] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, paymentId));

    if (!paymentRecord) {
      throw new Error("Payment not found");
    }

    if (!paymentRecord.orderId) {
      throw new Error("Order ID missing on payment");
    }

    const midtransOrderId = `${paymentRecord.orderId}-PAY${paymentRecord.id}`;

    // Check status via Midtrans Core API
    const statusResponse = await coreApi.transaction.status(midtransOrderId);

    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    const { calculatePaymentStatus } = await import("@/utils/midtransUtils");
    const { paymentStatus, newOrderStatus } = calculatePaymentStatus(
      transactionStatus,
      fraudStatus,
      paymentRecord.status
    );

    // Only update if changed
    if (paymentStatus !== paymentRecord.status) {
      await db
        .update(payments)
        .set({ status: paymentStatus, updatedAt: new Date() })
        .where(eq(payments.id, paymentId));

      if (newOrderStatus) {
        await db.update(orders).set({ status: newOrderStatus }).where(eq(orders.id, paymentRecord.orderId));
      }
    }

    return {
      success: true,
      status: paymentStatus,
      message: `Status berhasil disinkronisasi: ${paymentStatus}`
    };

  } catch (error: any) {
    console.error("Error checking payment status:", error);
    return { success: false, message: error.message || "Gagal mengecek status pembayaran" };
  }
}
