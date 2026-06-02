"use server";

import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { payments } from "@/db/schema";

export type OrderItemType = typeof orderItems.$inferSelect;
export type OrderType = typeof orders.$inferSelect;
export type PaymentType = typeof payments.$inferSelect;

export type OrderWithItems = OrderType & {
  items: OrderItemType[];
  payments?: PaymentType[];
};

export async function getOrders(): Promise<OrderWithItems[]> {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const allItems = await db.select().from(orderItems);

    // Group items by orderId
    const itemsByOrderId: Record<number, OrderItemType[]> = {};
    for (const item of allItems) {
      if (!itemsByOrderId[item.orderId]) {
        itemsByOrderId[item.orderId] = [];
      }
      itemsByOrderId[item.orderId].push(item);
    }

    return allOrders.map(order => ({
      ...order,
      items: itemsByOrderId[order.id] || []
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Gagal mengambil data pesanan");
  }
}

export async function getOrderById(id: number): Promise<OrderWithItems | null> {
  try {
    const orderResults = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (orderResults.length === 0) return null;

    const order = orderResults[0];
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

    return {
      ...order,
      items
    };
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw new Error("Gagal mengambil detail pesanan");
  }
}

export async function updateOrderStatus(id: number, status: string): Promise<boolean> {
  try {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Gagal memperbarui status pesanan");
  }
}
