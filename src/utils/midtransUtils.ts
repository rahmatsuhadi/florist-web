export function calculatePaymentStatus(
  transactionStatus: string,
  fraudStatus: string,
  currentStatus: string
): { paymentStatus: string; newOrderStatus: string | null } {
  let paymentStatus = currentStatus;
  let newOrderStatus = null;

  if (transactionStatus === "capture") {
    if (fraudStatus === "accept") {
      paymentStatus = "success";
      newOrderStatus = "Sudah Dibayar";
    } else {
      paymentStatus = "pending";
    }
  } else if (transactionStatus === "settlement") {
    paymentStatus = "success";
    newOrderStatus = "Sudah Dibayar";
  } else if (
    transactionStatus === "cancel" ||
    transactionStatus === "deny" ||
    transactionStatus === "expire"
  ) {
    paymentStatus = "failed";
  } else if (transactionStatus === "pending") {
    // Don't downgrade if already success
    if (paymentStatus !== "success") {
      paymentStatus = "pending";
    }
  }

  return { paymentStatus, newOrderStatus };
}

export function extractPaymentDetails(paymentType: string, authenticData: any): any {
  if (paymentType === "bank_transfer" && authenticData.va_numbers && authenticData.va_numbers.length > 0) {
    return authenticData.va_numbers[0];
  }
  if (paymentType === "bank_transfer" && authenticData.permata_va_number) {
    return { bank: "permata", va_number: authenticData.permata_va_number };
  }
  if (paymentType === "cstore") {
    return { store: authenticData.store, payment_code: authenticData.payment_code };
  }
  if (paymentType === "echannel") {
    return { biller_code: authenticData.biller_code, bill_key: authenticData.bill_key };
  }
  if (paymentType === "qris" || paymentType === "gopay") {
    return { issuer: authenticData.issuer || "gopay" };
  }
  if (paymentType === "shopeepay") {
    return { issuer: "shopeepay", reference_number: authenticData.shopeepay_reference_number };
  }
  
  return null;
}
