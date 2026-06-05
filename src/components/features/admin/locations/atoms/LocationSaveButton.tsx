"use client";

import { useFormStatus } from "react-dom";

export const LocationSaveButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto px-6 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
    >
      {pending ? "Menyimpan..." : "Simpan Wilayah"}
    </button>
  );
};
