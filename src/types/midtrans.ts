export interface MidtransNotificationPayload {
  va_numbers?: Array<{ bank: string; va_number: string }>;
  permata_va_number?: string;
  store?: string;
  payment_code?: string;
  biller_code?: string;
  bill_key?: string;
  issuer?: string;
  shopeepay_reference_number?: string;
  settlement_time?: string;
  transaction_time?: string;
  [key: string]: unknown;
}

export interface PaymentDetails {
  bank?: string;
  va_number?: string;
  store?: string;
  payment_code?: string;
  biller_code?: string;
  bill_key?: string;
  issuer?: string;
  reference_number?: string;
  paid_at?: string;
}
