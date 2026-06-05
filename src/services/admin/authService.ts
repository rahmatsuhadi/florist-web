"use server";

import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface LoginActionState {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
  inputs?: {
    email?: string;
  };
}

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(1, { message: "Password wajib diisi" }),
});

export const login = async (prevState: LoginActionState, formData: FormData): Promise<LoginActionState> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      inputs: { email },
    };
  }

  const [userRecord] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!userRecord) {
    return { success: false, message: "Email atau password salah", inputs: { email } };
  }

  const isPasswordValid = await bcrypt.compare(password, userRecord.passwordHash);

  if (!isPasswordValid) {
    return { success: false, message: "Email atau password salah", inputs: { email } };
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

  redirect("/admin");
};

export const logout = async () => {
  (await cookies()).delete("admin_session");
  return { success: true };
};
