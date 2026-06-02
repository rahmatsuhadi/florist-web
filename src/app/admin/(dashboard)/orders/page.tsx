import { OrderList } from "@/components/organisms/admin/order/OrderList";
import { Metadata } from "next";
import { getOrders } from "@/services/admin/orderService";

export const metadata: Metadata = {
  title: "Manajemen Pesanan | Admin",
  description: "Kelola pesanan dari pelanggan",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrderList initialOrders={orders} />;
}
