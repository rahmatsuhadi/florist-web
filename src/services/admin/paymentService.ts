"use server";

import { db } from "@/db";
import { payments, orders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export type PaymentWithCustomer = typeof payments.$inferSelect & {
  customerName: string;
};

export async function getPaymentHistory(): Promise<PaymentWithCustomer[]> {
  try {
    const results = await db
      .select({
        payment: payments,
        customerName: orders.customerName,
      })
      .from(payments)
      .leftJoin(orders, eq(payments.orderId, orders.id))
      .orderBy(desc(payments.createdAt));

    return results.map((row) => ({
      ...row.payment,
      customerName: row.customerName || "Pelanggan Umum",
    }));
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw new Error("Gagal mengambil data riwayat pembayaran");
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
