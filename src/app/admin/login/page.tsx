import { LoginForm } from "@/components/organisms/admin/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Fleuriste Bouquet",
  description: "Login page for Admin Workspace",
};

export default function AdminLoginPage() {
  return <LoginForm />;
}
