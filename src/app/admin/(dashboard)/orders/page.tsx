import { OrderList } from "@/components/organisms/admin/order/OrderList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Pesanan | Admin",
  description: "Kelola pesanan dari pelanggan",
};

export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  return <OrderList />;
}
