"use server";

import { Package, MessageCircle, TrendingUp, AlertCircle, LucideIcon } from "lucide-react";
import { db } from "@/db";
import { products, orders, orderItems } from "@/db/schema";
import { desc, count, sql } from "drizzle-orm";

export interface Transaction {
  id: string;
  name: string;
  phone: string;
  product: string;
  total: string;
  status: string;
  date: string;
}

export interface DashboardMetrics {
  pendingPayment: number;
  processingOrders: number;
  shippingOrders: number;
  totalRevenue: number;
}

export const getDashboardStats = async (): Promise<DashboardMetrics> => {
  const allOrders = await db.select({
    status: orders.status,
    totalAmount: orders.totalAmount,
  }).from(orders);

  const pendingPayment = allOrders.filter((o) => o.status === "Menunggu Pembayaran").length;
  const processingOrders = allOrders.filter((o) => o.status === "Sudah Dibayar" || o.status === "Sedang Diproses").length;
  const shippingOrders = allOrders.filter((o) => o.status === "Sedang Dikirim").length;
  
  const totalRevenue = allOrders
    .filter((o) => o.status === "Selesai")
    .reduce((sum, current) => sum + Number(current.totalAmount || 0), 0);

  return {
    pendingPayment,
    processingOrders,
    shippingOrders,
    totalRevenue,
  };
};

export const getRecentTransactions = async (): Promise<Transaction[]> => {
  const recentOrders = await db
    .select({
      id: orders.id,
      name: orders.customerName,
      phone: orders.customerPhone,
      status: orders.status,
      total: orders.totalAmount,
      date: orders.createdAt,
      productName: orderItems.productName,
    })
    .from(orders)
    .leftJoin(orderItems, sql`${orders.id} = ${orderItems.orderId}`)
    .orderBy(desc(orders.createdAt))
    .limit(5);

  // Map to the required interface
  return recentOrders.map((ro) => ({
    id: `TRX-${ro.id.toString().padStart(3, "0")}`,
    name: ro.name,
    phone: ro.phone,
    product: ro.productName || "Unknown Product",
    total: ro.total,
    status: ro.status,
    date: ro.date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
};
