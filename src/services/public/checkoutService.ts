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

import { snap } from "@/lib/midtrans";
import { payments } from "@/db/schema";
import { createNotification } from "@/services/admin/notificationService";
import { formatIdr } from "@/utils/format";

export async function createOrder(data: CreateOrderData) {
  try {
    // 1. Insert Order
    const uniqueOrderId = `trx-${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36).substring(4)}`;

    const [newOrder] = await db.insert(orders).values({
      id: uniqueOrderId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      customerNotes: data.customerNotes || "",
      totalAmount: data.totalAmount,
      status: "Menunggu Pembayaran",
    }).returning();

    // 2. Insert Order Items
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

    // 3. Create initial Payment Record
    const [newPayment] = await db.insert(payments).values({
      orderId: newOrder.id,
      amount: data.totalAmount,
      status: "pending"
    }).returning();

    // 4. Request Midtrans Snap Token
    const midtransParams = {
      transaction_details: {
        order_id: `${newOrder.id}-PAY${newPayment.id}`,
        gross_amount: Number(data.totalAmount)
      },
      customer_details: {
        first_name: data.customerName,
        phone: data.customerPhone,
        billing_address: {
          first_name: data.customerName,
          address: data.customerAddress,
        }
      }
    };

    let paymentToken = null;
    let paymentUrl = null;

    try {
      const transaction = await snap.createTransaction(midtransParams);
      paymentToken = transaction.token;
      paymentUrl = transaction.redirect_url;

      // 5. Update Payment Record with Token & URL
      await db.update(payments)
        .set({ paymentToken, paymentUrl })
        .where(eq(payments.id, newPayment.id));
    } catch (midtransError) {
      console.error("Failed to generate Midtrans token:", midtransError);
    }

    // 6. Create Notification
    try {
      await createNotification({
        title: "Pesanan Baru Masuk!",
        message: `Pesanan baru ${newOrder.id} senilai ${formatIdr(Number(data.totalAmount))} dari ${data.customerName}.`,
        type: "order",
        link: `/admin/orders/${newOrder.id}`,
      });
    } catch (notifError) {
      console.error("Failed to create new order notification:", notifError);
    }

    return {
      success: true,
      orderId: newOrder.id,
      paymentToken,
      paymentUrl
    };
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

    const itemsByOrderId: Record<string, OrderItemType[]> = {};
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

export async function getPublicOrderById(id: string): Promise<OrderWithItems | null> {
  try {
    const orderResults = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (orderResults.length === 0) return null;

    const order = orderResults[0];
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    const orderPayments = await db.select().from(payments).where(eq(payments.orderId, id));

    return {
      ...order,
      items,
      payments: orderPayments
    };
  } catch (error) {
    console.error("Error fetching public order:", error);
    return null;
  }
}

export async function generateNewPaymentToken(orderId: string) {
  try {
    const orderResults = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (orderResults.length === 0) return { success: false, error: "Pesanan tidak ditemukan" };
    const order = orderResults[0];

    // Create a new Payment Record (this ensures we have a log of multiple attempts)
    const [newPayment] = await db.insert(payments).values({
      orderId: order.id,
      amount: order.totalAmount,
      status: "pending"
    }).returning();

    const midtransParams = {
      transaction_details: {
        order_id: `${order.id}-PAY${newPayment.id}`,
        gross_amount: Number(order.totalAmount)
      },
      customer_details: {
        first_name: order.customerName,
        phone: order.customerPhone,
        billing_address: {
          first_name: order.customerName,
          address: order.customerAddress || "",
        }
      }
    };

    let paymentToken = null;
    let paymentUrl = null;

    const transaction = await snap.createTransaction(midtransParams);
    paymentToken = transaction.token;
    paymentUrl = transaction.redirect_url;

    // Update the new Payment Record with Token & URL
    await db.update(payments)
      .set({ paymentToken, paymentUrl })
      .where(eq(payments.id, newPayment.id));

    return { success: true, paymentToken, paymentUrl };
  } catch (error) {
    console.error("Failed to generate new payment token:", error);
    return { success: false, error: "Gagal membuat token pembayaran baru" };
  }
}
