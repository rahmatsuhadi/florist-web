"use server";

import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";
import bcrypt from "bcryptjs";

// In a real application, you would fetch this from a 'users' table in the database
// For this MVP, we use hardcoded credentials as requested for simplicity
const ADMIN_EMAIL = "admin@fleuriste.com";
// Hashed "admin123"
const ADMIN_PASSWORD_HASH = "$2b$10$or2l.zj9Ga8/A2dXPhhyOeefSCTYs7yjRPYjatyc/SUc2fmF6DuYi";

export const login = async (email: string, password: string) => {
  if (email !== ADMIN_EMAIL) {
    return { success: false, error: "Invalid credentials" };
  }

  const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

  if (!isPasswordValid) {
    return { success: false, error: "Invalid credentials" };
  }

  const user = {
    id: "1",
    name: "Admin Utama",
    role: "Superadmin",
    initial: "A",
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
