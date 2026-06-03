"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { LoadingSpinner } from "@/components/atoms/admin/LoadingSpinner";

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

  return (
    <AnimatePresence mode="wait">
      {isLoading || !metrics ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoadingSpinner text="Memuat Dashboard..." className="h-[60vh]" />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          <DashboardWelcomeBanner storeName={store?.name} />
          <DashboardStatsCards metrics={metrics} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <DashboardRecentTransactions transactions={transactions} />
            <DashboardQuickActions />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
