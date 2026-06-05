"use client";

import { useFormStatus } from "react-dom";
import { Save, Loader2 } from "lucide-react";

interface SaveButtonProps {
  label?: string;
  className?: string;
}

/**
 * Uses useFormStatus to automatically show a pending spinner
 * when the parent <form> is submitting via a Server Action.
 */
export const SaveButton: React.FC<SaveButtonProps> = ({
  label = "Simpan",
  className = "",
}) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-1 px-3 py-1 h-8 text-xs font-sans font-medium
        border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white
        rounded-none transition-all duration-300 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {pending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
      {label}
    </button>
  );
};
