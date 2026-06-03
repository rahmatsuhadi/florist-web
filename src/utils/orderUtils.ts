import { OrderWithItems } from "@/services/admin/orderService";

export const getStatusStyle = (status: string) => {
  switch (status) {
    case "Menunggu Pembayaran": return "bg-orange-50 border border-orange-200 text-orange-700";
    case "Sudah Dibayar": return "bg-blue-50 border border-blue-200 text-blue-700";
    case "Sedang Diproses": return "bg-purple-50 border border-purple-200 text-purple-700";
    case "Sedang Dikirim": return "bg-yellow-50 border border-yellow-200 text-yellow-700";
    case "Siap Diambil": return "bg-teal-50 border border-teal-200 text-teal-700";
    case "Selesai": return "bg-emerald-50 border border-emerald-200 text-emerald-700";
    case "Dibatalkan": return "bg-red-50 border border-red-200 text-red-700";
    default: return "bg-gray-50 border border-gray-200 text-gray-700";
  }
};

export const isUrgentOrder = (trx: Partial<OrderWithItems> | any) => {
  if (trx.status !== "Sudah Dibayar" && trx.status !== "Sedang Diproses") return false;

  if (!trx.scheduledDate) return false;

  const scheduled = new Date(trx.scheduledDate);
  const today = new Date();

  // Urgent if scheduled date is today or tomorrow (or passed)
  scheduled.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return scheduled.getTime() <= today.getTime() + 86400000;
};
