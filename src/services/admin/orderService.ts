"use server";

import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, desc, and, or, ilike, gte, lte, inArray, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { payments } from "@/db/schema";

export type OrderItemType = typeof orderItems.$inferSelect;
export type OrderType = typeof orders.$inferSelect;
export type PaymentType = typeof payments.$inferSelect;

export type OrderWithItems = OrderType & {
  items: OrderItemType[];
  payments?: PaymentType[];
};

export interface OrderFilterParams {
  q?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export async function getOrders(params?: OrderFilterParams): Promise<{ data: OrderWithItems[], total: number }> {
  try {
    const filters: SQL[] = [];

    if (params?.q) {
      const searchPattern = `%${params.q}%`;
      filters.push(
        or(
          ilike(orders.id, searchPattern),
          ilike(orders.customerName, searchPattern),
          ilike(orders.customerPhone, searchPattern)
        )!
      );
    }

    if (params?.status && params.status !== "Semua Status") {
      filters.push(eq(orders.status, params.status));
    }

    if (params?.startDate) {
      // scheduledDate format is assumed to be ISO string YYYY-MM-DD
      filters.push(gte(orders.scheduledDate, params.startDate));
    }

    if (params?.endDate) {
      filters.push(lte(orders.scheduledDate, params.endDate));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const allMatchedOrders = await db.select().from(orders).where(whereClause).orderBy(desc(orders.createdAt));
    const total = allMatchedOrders.length;
    
    if (total === 0) {
      return { data: [], total: 0 };
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const safePage = Math.max(1, Math.min(page, Math.max(1, Math.ceil(total / limit))));
    
    const paginatedOrders = allMatchedOrders.slice((safePage - 1) * limit, safePage * limit);
    const orderIds = paginatedOrders.map(o => o.id);

    const items = await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds));

    // Group items by orderId
    const itemsByOrderId: Record<string, OrderItemType[]> = {};
    for (const item of items) {
      if (!itemsByOrderId[item.orderId]) {
        itemsByOrderId[item.orderId] = [];
      }
      itemsByOrderId[item.orderId].push(item);
    }

    const data = paginatedOrders.map(order => ({
      ...order,
      items: itemsByOrderId[order.id] || []
    }));

    return { data, total };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Gagal mengambil data pesanan");
  }
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
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

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
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
