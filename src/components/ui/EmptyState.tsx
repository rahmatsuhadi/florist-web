import { ReactNode } from "react";
import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: ReactNode;
  fullPage?: boolean;
}

export const EmptyState = ({ title, message, action, fullPage = false }: EmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center font-sans ${
        fullPage ? "pt-40 pb-24 min-h-[60vh]" : "py-20"
      }`}
    >
      <FileQuestion size={48} className="text-[#E8D9D2] mb-6" strokeWidth={1.5} />
      <h3 className="font-playfair text-2xl text-[#2C302E] mb-3">{title}</h3>
      {message && <p className="text-[#5A635E] max-w-md mx-auto leading-relaxed">{message}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
};
