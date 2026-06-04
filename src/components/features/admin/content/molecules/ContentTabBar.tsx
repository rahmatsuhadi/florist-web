"use client";

import { useState } from "react";
import { TabButton } from "../atoms/TabButton";

interface ContentTabBarProps {
  children: (activeTab: "hero" | "gallery") => React.ReactNode;
}

/**
 * Client component that manages tab state (hero/gallery).
 * Uses render-prop pattern (children as function) to pass activeTab
 * down without making the entire parent a client component.
 */
export const ContentTabBar: React.FC<ContentTabBarProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<"hero" | "gallery">("hero");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-brand/20 overflow-hidden">
      <div className="flex border-b border-brand/20">
        <TabButton
          label="Banner Hero"
          isActive={activeTab === "hero"}
          onClick={() => setActiveTab("hero")}
        />
        <TabButton
          label="Galeri Foto"
          isActive={activeTab === "gallery"}
          onClick={() => setActiveTab("gallery")}
        />
      </div>
      <div className="p-6">{children(activeTab)}</div>
    </div>
  );
};

