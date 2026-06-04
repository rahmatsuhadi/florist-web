import { OrderWithItems } from "@/services/admin/orderService";
import { formatIdr } from "@/utils/format";

export const generateWhatsAppMessage = (transaction: OrderWithItems, status: string) => {
  const baseGreeting = `Halo ${transaction.customerName}, terima kasih telah mempercayakan momen spesial Anda kepada Magnolia Florist. ✨\n\n`;
  if (status === "Menunggu Pembayaran") {
    return encodeURIComponent(
      `${baseGreeting}Kami ingin mengonfirmasi pesanan rangkaian *${transaction.items.length > 0 ? transaction.items[0].productName : "bunga"}* Anda dengan kode transaksi *${transaction.id}* sebesar *${formatIdr(Number(transaction.totalAmount))}*.\n\nMohon lakukan transfer ke rekening bank kami dan kirimkan bukti transfer ke chat ini agar kami dapat memproses pesanan Anda. Terima kasih!`
    );
  } else if (status === "Sudah Dibayar") {
    return encodeURIComponent(
      `${baseGreeting}Kami telah menerima pembayaran Anda untuk pesanan *${transaction.id}* berisikan *${transaction.items.length > 0 ? transaction.items[0].productName : "bunga"}*.\n\nTerima kasih atas konfirmasinya. Pembayaran Anda telah terverifikasi dengan sukses!`
    );
  } else if (status === "Sedang Diproses") {
    return encodeURIComponent(
      `${baseGreeting}Kabar baik! Saat ini pesanan Anda *${transaction.id}* sedang dirangkai oleh tim Florist kami dengan dedikasi penuh. Kami akan segera menginfokan kembali saat pesanan siap diantar.`
    );
  } else if (status === "Sedang Dikirim") {
    return encodeURIComponent(
      `${baseGreeting}Pesanan mawar/bunga indah Anda *${transaction.id}* saat ini sudah diserahkan ke kurir dan sedang dalam perjalanan menuju alamat tujuan.\n\nSemoga bunga sampai dengan aman dan segar bugar!`
    );
  } else if (status === "Siap Diambil") {
    return encodeURIComponent(
      `${baseGreeting}Kabar baik! Pesanan Anda *${transaction.id}* sudah selesai dirangkai dan siap untuk diambil di toko kami. Ditunggu kedatangannya ya! 🌸`
    );
  } else if (status === "Selesai") {
    return encodeURIComponent(
      `${baseGreeting}Pesanan Anda *${transaction.id}* berisikan *${transaction.items.length > 0 ? transaction.items[0].productName : "bunga"}* telah berhasil dikirimkan ke alamat tujuan dengan selamat. 🌸\n\nSemoga rangkaian kami dapat memperindah momen istimewa Anda hari ini. Jika berkenan, silakan bagikan kepuasan Anda bersama kami di Instagram!`
    );
  } else {
    return encodeURIComponent(
      `${baseGreeting}Kami ingin menginformasikan bahwa transaksi *${transaction.id}* saat ini berstatus dibatalkan.`
    );
  }
};
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

export const getStatusDescription = (status: string) => {
  switch (status) {
    case "Menunggu Pembayaran":
      return "Pesanan Anda telah kami terima. Silakan selesaikan pembayaran agar pesanan dapat segera diproses.";
    case "Sudah Dibayar":
      return "Pembayaran telah terverifikasi. Pesanan Anda akan segera diproses oleh tim kami.";
    case "Sedang Diproses":
      return "Tim florist kami sedang merangkai pesanan Anda dengan penuh dedikasi.";
    case "Sedang Dikirim":
      return "Pesanan Anda sedang dalam perjalanan ke lokasi tujuan oleh kurir kami.";
    case "Siap Diambil":
      return "Pesanan sudah siap diambil ke toko fisik kami. Ditunggu kedatangannya ya!";
    case "Selesai":
      return "Pesanan telah selesai. Terima kasih telah berbelanja bersama kami!";
    case "Dibatalkan":
      return "Pesanan telah dibatalkan. Jika ada pertanyaan, hubungi kami via WhatsApp.";
    default:
      return "Menunggu konfirmasi lebih lanjut.";
  }
};
