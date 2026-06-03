import { PaymentWithCustomer } from "@/services/admin/paymentService";

export const getPaymentDetailsText = (pay: PaymentWithCustomer) => {
  if (!pay.paymentDetails) return 'N/A';
  const details = pay.paymentDetails as any;
  
  if (pay.paymentMethod === 'bank_transfer') {
    return `${(details.bank || 'Bank').toUpperCase()} VA: ${details.va_number || ''}`;
  } else if (pay.paymentMethod === 'cstore') {
    return `${(details.store || 'Gerai').toUpperCase()}: ${details.payment_code || ''}`;
  } else if (pay.paymentMethod === 'qris' || pay.paymentMethod === 'gopay') {
    return `Issuer: ${(details.issuer || 'Gopay').toUpperCase()}`;
  } else if (pay.paymentMethod === 'shopeepay') {
    return `Issuer: SHOPEEPAY (Ref: ${details.reference_number || '-'})`;
  }
  return 'Lihat Detail';
};
