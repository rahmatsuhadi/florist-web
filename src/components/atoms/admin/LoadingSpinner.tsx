import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text, className = "h-64" }) => {
  return (
    <div className={`flex flex-col items-center justify-center w-full ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-10 h-10 border-4 border-brand/30 border-t-brand rounded-full mb-4"
      />
      {text && <p className="text-gray-500 font-medium">{text}</p>}
    </div>
  );
};
