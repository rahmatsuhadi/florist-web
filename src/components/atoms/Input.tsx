import type React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  className = "",
  ...props
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="mb-4">
      <label
        htmlFor={inputId}
        className="block font-sans text-sm text-[#5A635E] mb-2"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full border-b border-[#E8D9D2] bg-transparent py-2 px-1 focus:outline-none focus:border-[#829E8D] transition-colors font-sans text-[#2C302E] ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
