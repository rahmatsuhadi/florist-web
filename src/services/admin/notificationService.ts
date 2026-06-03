"use server";

import { db } from "@/db";
import { notifications } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export async function getNotifications(limit = 20) {
  try {
    const data = await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
    return data;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}

export async function createNotification(data: Omit<NewNotification, "id" | "createdAt" | "isRead">) {
  try {
    const newNotif = await db.insert(notifications).values(data).returning();
    revalidatePath("/admin"); // Revalidate admin routes
    return newNotif[0];
  } catch (error) {
    console.error("Failed to create notification:", error);
    throw error;
  }
}

export async function markAsRead(id: number) {
  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
    revalidatePath("/admin");
    return true;
  } catch (error) {
    console.error(`Failed to mark notification ${id} as read:`, error);
    return false;
  }
}

export async function markAllAsRead() {
  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.isRead, false));
    revalidatePath("/admin");
    return true;
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return false;
  }
}
