import React from "react";
import {
  getDashboardStats,
  getRecentTransactions,
} from "@/services/admin/dashboardService";
import { getStoreSettings } from "@/services/admin/storefrontService";

import { DashboardWelcomeBanner } from "./DashboardWelcomeBanner";
import { DashboardStatsCards } from "./DashboardStatsCards";
import { DashboardRecentTransactions } from "./DashboardRecentTransactions";
import { DashboardQuickActions } from "./DashboardQuickActions";
import { FadeInUpWrapper } from "@/components/ui/MotionWrappers";

export const DashboardOverview = async () => {
  const [metrics, transactions, store] = await Promise.all([
    getDashboardStats(),
    getRecentTransactions(),
    getStoreSettings()
  ]);

  return (
    <FadeInUpWrapper className="space-y-8">
      <DashboardWelcomeBanner storeName={store?.name} />
      <DashboardStatsCards metrics={metrics} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <DashboardRecentTransactions transactions={transactions} />
        <DashboardQuickActions />
      </div>
    </FadeInUpWrapper>
  );
};
