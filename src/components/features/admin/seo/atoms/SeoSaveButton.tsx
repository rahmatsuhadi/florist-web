"use client";

import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";

export const SeoSaveButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
    >
      <Save size={18} />
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </button>
  );
};
