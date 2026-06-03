import type React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: "underline" | "outline";
  icon?: React.ReactNode;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  id,
  className = "",
  error,
  variant = "underline",
  icon,
  ...props
}) => {
  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, "-")}` : `textarea-${Math.random()}`);

  const baseClasses = "w-full focus:outline-none transition-colors font-sans text-[#2C302E] bg-transparent resize-none";
  
  const underlineClasses = `border-b py-2 px-1 ${
    error 
      ? "border-red-400 focus:border-red-400" 
      : "border-[#E8D9D2] focus:border-[#829E8D]"
  }`;

  const outlineClasses = `border rounded-none p-4 ${icon ? "pl-10" : ""} bg-white ${
    error 
      ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400" 
      : "border-[#E8D9D2] focus:border-[#829E8D] focus:ring-1 focus:ring-[#829E8D]"
  }`;

  const combinedClasses = `${baseClasses} ${variant === "outline" ? outlineClasses : underlineClasses} ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={textareaId}
          className="block font-sans text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
        >
          {icon}
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={combinedClasses}
        {...props}
      />
      {error && (
        <span className="block font-sans text-xs text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Textarea;
