"use client";

import dynamic from "next/dynamic";

export const LazyStoreMap = dynamic(() => import("@/components/features/checkout/molecules/StoreMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-gray-100 text-sm font-sans text-[#5A635E] border border-[#E8D9D2]">
      Memuat Peta...
    </div>
  ),
});
