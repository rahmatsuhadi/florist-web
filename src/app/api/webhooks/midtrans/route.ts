import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments, orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { coreApi } from "@/lib/midtrans";
import { calculatePaymentStatus, extractPaymentDetails } from "@/utils/midtransUtils";

export async function POST(req: Request) {
  try {
    const body = await req.json();


    // Verify signature key from Midtrans to ensure authenticity (Layer 1)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const expectedSignature = crypto.createHash("sha512")
      .update(body.order_id + body.status_code + body.gross_amount + serverKey)
      .digest("hex");

    if (expectedSignature !== body.signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const { transaction_id } = body;
    if (!transaction_id) {
      return NextResponse.json({ error: "Missing transaction_id" }, { status: 400 });
    }

    // Double check with Midtrans Server to prevent tampering/replays (Layer 2)
    const authenticData = await coreApi.transaction.status(transaction_id);

    const transactionStatus = authenticData.transaction_status;
    const fraudStatus = authenticData.fraud_status;
    const midtransOrderId = authenticData.order_id;
    const paymentType = authenticData.payment_type;
    const grossAmount = parseFloat(authenticData.gross_amount);

    if (!midtransOrderId.includes("-PAY")) {
      return NextResponse.json({ message: "Ignored unrelated order" });
    }

    const parts = midtransOrderId.split("-PAY");
    const paymentId = parseInt(parts[1], 10);
    if (isNaN(paymentId)) {
      return NextResponse.json({ error: "Invalid payment ID format" }, { status: 400 });
    }

    // Check if payment exists
    const [paymentRecord] = await db.select().from(payments).where(eq(payments.id, paymentId));
    if (!paymentRecord) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Verify amount matches (Layer 3)
    const expectedAmount = parseFloat(paymentRecord.amount);
    if (grossAmount !== expectedAmount) {
      console.warn(`Amount mismatch for payment ${paymentId}: Expected ${expectedAmount}, got ${grossAmount}`);
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    const { paymentStatus, newOrderStatus } = calculatePaymentStatus(
      transactionStatus,
      fraudStatus,
      paymentRecord.status
    );

    const paymentDetails = extractPaymentDetails(paymentType, authenticData);
    
    console.log(paymentDetails, "Payment Detail");

    // 1. Update Payment Record
    await db.update(payments)
      .set({
        status: paymentStatus,
        paymentMethod: paymentType,
        paymentDetails,
        midtransTransactionId: transaction_id,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, paymentId));

    // 2. Update Order Record if successful
    if (newOrderStatus) {
      await db.update(orders)
        .set({
          status: newOrderStatus,
          updatedAt: new Date()
        })
        .where(eq(orders.id, paymentRecord.orderId));
    }

    return NextResponse.json({ status: "success" });

  } catch (error) {
    console.error("Midtrans Webhook Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
