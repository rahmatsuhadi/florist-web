import type React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "underline" | "outline";
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  className = "",
  error,
  variant = "underline",
  icon,
  rightElement,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : `input-${Math.random()}`);

  const baseClasses = "w-full focus:outline-none transition-colors font-sans text-[#2C302E] bg-transparent";
  
  const underlineClasses = `border-b py-2 px-1 ${
    error 
      ? "border-red-400 focus:border-red-400" 
      : "border-[#E8D9D2] focus:border-[#829E8D]"
  }`;

  const outlineClasses = `border rounded-none py-3 ${icon ? "pl-10" : "px-4"} ${rightElement ? "pr-12" : "pr-4"} bg-white ${
    error 
      ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400" 
      : "border-[#E8D9D2] focus:border-[#829E8D] focus:ring-1 focus:ring-[#829E8D]"
  }`;

  const combinedClasses = `${baseClasses} ${variant === "outline" ? outlineClasses : underlineClasses} ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-sans text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={combinedClasses}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <span className="block font-sans text-xs text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
