export const formatIdr = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, "");
  
  // Convert leading 0 to 62
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  
  return cleaned;
};
