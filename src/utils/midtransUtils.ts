// Definisi agar tidak ada typo
export const PaymentStatus = {
  SUCCESS: 'success',
  PENDING: 'pending',
  FAILED: 'failed',
} as const;

export function calculatePaymentStatus(
  transactionStatus: string,
  fraudStatus: string,
  currentStatus: string
) {
  // Definisikan status default
  let paymentStatus = currentStatus;
  let newOrderStatus: string | null = null;

  //  Jika sudah sukses, jangan pernah ubah ke status lain
  if (currentStatus === PaymentStatus.SUCCESS) {
    return { paymentStatus: PaymentStatus.SUCCESS, newOrderStatus: "Sudah Dibayar" };
  }

  // Logic utama (Switch-case lebih rapi daripada if-else bertingkat)
  switch (transactionStatus) {
    case 'capture':
      if (fraudStatus === 'accept') {
        paymentStatus = PaymentStatus.SUCCESS;
        newOrderStatus = "Sudah Dibayar";
      } else {
        paymentStatus = PaymentStatus.PENDING;
      }
      break;

    case 'settlement':
      paymentStatus = PaymentStatus.SUCCESS;
      newOrderStatus = "Sudah Dibayar";
      break;

    case 'cancel':
    case 'deny':
    case 'expire':
      paymentStatus = PaymentStatus.FAILED;
      break;

    case 'pending':
      paymentStatus = PaymentStatus.PENDING;
      break;
  }

  return { paymentStatus, newOrderStatus };
}

import { MidtransNotificationPayload, PaymentDetails } from "@/types/midtrans";

export function extractPaymentDetails(
  paymentType: string,
  authenticData: MidtransNotificationPayload
): PaymentDetails | null {
  let details: PaymentDetails = {};

  if (paymentType === "bank_transfer" && authenticData.va_numbers && authenticData.va_numbers.length > 0) {
    details = { ...authenticData.va_numbers[0] };
  } else if (paymentType === "bank_transfer" && authenticData.permata_va_number) {
    details = { bank: "permata", va_number: authenticData.permata_va_number };
  } else if (paymentType === "cstore") {
    details = { store: authenticData.store, payment_code: authenticData.payment_code };
  } else if (paymentType === "echannel") {
    details = { biller_code: authenticData.biller_code, bill_key: authenticData.bill_key };
  } else if (paymentType === "qris" || paymentType === "gopay") {
    details = { issuer: authenticData.issuer || "gopay" };
  } else if (paymentType === "shopeepay") {
    details = { issuer: "shopeepay", reference_number: authenticData.shopeepay_reference_number };
  }

  if (authenticData.settlement_time) {
    details.paid_at = authenticData.settlement_time;
  }

  return Object.keys(details).length > 0 ? details : null;
}
