"use server";

import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";

import { VariantDetail } from "@/store/AppContext";

export interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes?: string;
  totalAmount: string;
  items: {
    productId?: number;
    productName: string;
    productImage?: string;
    productPrice: string;
    productCategory: string;
    quantity: number;
    variantDetails: VariantDetail[];
    notes?: string;
  }[];
}

export async function createOrder(data: CreateOrderData) {
  try {
    const [newOrder] = await db.insert(orders).values({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      customerNotes: data.customerNotes || "",
      totalAmount: data.totalAmount,
      status: "Menunggu Pembayaran",
    }).returning();

    const orderItemsToInsert = data.items.map(item => ({
      orderId: newOrder.id,
      productId: item.productId || null,
      productName: item.productName,
      productImage: item.productImage || null,
      productPrice: item.productPrice,
      productCategory: item.productCategory,
      quantity: item.quantity,
      variantDetails: item.variantDetails,
      notes: item.notes || null,
    }));


    await db.insert(orderItems).values(orderItemsToInsert);

    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Gagal membuat pesanan" };
  }
}

import { desc } from "drizzle-orm";
import { OrderItemType, OrderType, OrderWithItems } from "../admin/orderService";

export async function getOrdersByPhone(phone: string): Promise<OrderWithItems[]> {
  try {
    const userOrders = await db.select().from(orders).where(eq(orders.customerPhone, phone)).orderBy(desc(orders.createdAt));
    if (userOrders.length === 0) return [];

    const orderIds = userOrders.map(o => o.id);
    // Fetch items for these orders. Drizzle in-array can be used, or just fetch all and filter.
    // For simplicity, we fetch all items and filter by orderIds since the list shouldn't be massive for a single phone.
    const allItems = await db.select().from(orderItems);
    const relevantItems = allItems.filter(item => orderIds.includes(item.orderId));

    const itemsByOrderId: Record<number, OrderItemType[]> = {};
    for (const item of relevantItems) {
      if (!itemsByOrderId[item.orderId]) {
        itemsByOrderId[item.orderId] = [];
      }
      itemsByOrderId[item.orderId].push(item);
    }

    return userOrders.map(order => ({
      ...order,
      items: itemsByOrderId[order.id] || []
    }));
  } catch (error) {
    console.error("Error fetching orders by phone:", error);
    return [];
  }
}

export async function getPublicOrderById(id: number): Promise<OrderWithItems | null> {
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
    console.error("Error fetching public order:", error);
    return null;
  }
}
