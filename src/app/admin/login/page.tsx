import { LoginForm } from "@/components/features/admin/core/organisms/auth/LoginForm";
import { Metadata } from "next";
import { getStoreSettings } from "@/services/admin/storefrontService";

export async function generateMetadata(): Promise<Metadata> {
  const storeSettings = await getStoreSettings();
  const storeName = storeSettings.name || "Fleuriste";
  return {
    title: `Admin Login | ${storeName}`,
    description: "Login page for Admin Workspace",
  };
}

export default async function AdminLoginPage() {
  const storeSettings = await getStoreSettings();
  const storeName = storeSettings.name || "Fleuriste";
  
  return <LoginForm storeName={storeName} />;
}
