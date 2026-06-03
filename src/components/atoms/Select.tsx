import type React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  variant?: "underline" | "outline";
  icon?: React.ReactNode;
  options: Option[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  id,
  className = "",
  error,
  variant = "underline",
  icon,
  options,
  ...props
}) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : `select-${Math.random()}`);

  const baseClasses = "w-full focus:outline-none transition-colors font-sans text-[#2C302E] bg-transparent appearance-none";
  
  const underlineClasses = `border-b py-2 px-1 ${
    error 
      ? "border-red-400 focus:border-red-400" 
      : "border-[#E8D9D2] focus:border-[#829E8D]"
  }`;

  const outlineClasses = `border rounded-none py-3 ${icon ? "pl-10 pr-10" : "px-4 pr-10"} bg-white ${
    error 
      ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400" 
      : "border-[#E8D9D2] focus:border-[#829E8D] focus:ring-1 focus:ring-[#829E8D]"
  }`;

  const combinedClasses = `${baseClasses} ${variant === "outline" ? outlineClasses : underlineClasses} ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={selectId}
          className="block font-sans text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <select
          id={selectId}
          className={combinedClasses}
          {...props}
        >
          <option value="" disabled>Pilih opsi...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom Dropdown Arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {error && (
        <span className="block font-sans text-xs text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
