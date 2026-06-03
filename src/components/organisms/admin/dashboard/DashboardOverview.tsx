"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  getDashboardStats,
  getRecentTransactions,
  DashboardMetrics,
  Transaction
} from "@/services/admin/dashboardService";
import { getStoreSettings, StoreSettingsData } from "@/services/admin/storefrontService";

import { DashboardWelcomeBanner } from "./DashboardWelcomeBanner";
import { DashboardStatsCards } from "./DashboardStatsCards";
import { DashboardRecentTransactions } from "./DashboardRecentTransactions";
import { DashboardQuickActions } from "./DashboardQuickActions";

export const DashboardOverview = () => {
  const router = useRouter();

  const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [store, setStore] = React.useState<StoreSettingsData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, trxData, storeData] = await Promise.all([
          getDashboardStats(),
          getRecentTransactions(),
          getStoreSettings()
        ]);
        setMetrics(statsData);
        setTransactions(trxData);
        setStore(storeData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-4 border-brand/30 border-t-brand rounded-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <DashboardWelcomeBanner storeName={store?.name} />
      <DashboardStatsCards metrics={metrics} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <DashboardRecentTransactions transactions={transactions} />
        <DashboardQuickActions />
      </div>
    </motion.div>
  );
};
