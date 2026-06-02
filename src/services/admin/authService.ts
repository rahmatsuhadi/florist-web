"use server";

import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";
import bcrypt from "bcryptjs";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const login = async (email: string, password: string) => {
  const [userRecord] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!userRecord) {
    return { success: false, error: "Email atau password salah" };
  }

  const isPasswordValid = await bcrypt.compare(password, userRecord.passwordHash);

  if (!isPasswordValid) {
    return { success: false, error: "Email atau password salah" };
  }

  const user = {
    id: userRecord.id.toString(),
    name: userRecord.name,
    role: userRecord.role,
    initial: userRecord.name.charAt(0).toUpperCase(),
  };

  const session = await encrypt({ user, time: new Date().toISOString() });

  (await cookies()).set("admin_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return { success: true, user };
};

export const logout = async () => {
  (await cookies()).delete("admin_session");
  return { success: true };
};
