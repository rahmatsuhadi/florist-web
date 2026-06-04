import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center px-6 py-3 rounded-none font-sans font-medium transition-all duration-300 cursor-pointer";

  const variants = {
    primary: "bg-[#829E8D] text-white hover:bg-[#6c8575] hover:shadow-lg",
    outline:
      "border border-[#2C302E] text-[#2C302E] hover:bg-[#2C302E] hover:text-white",
    ghost: "text-[#2C302E] hover:opacity-70",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
