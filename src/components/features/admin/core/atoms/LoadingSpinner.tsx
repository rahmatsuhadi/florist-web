"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text, className = "h-64" }) => {
  return (
    <div className={`flex flex-col items-center justify-center w-full ${className}`}>
      <div className="relative flex items-center justify-center w-32 h-32 mb-6">
        {/* Outer Static Ring */}
        <div className="absolute inset-0 rounded-full border border-brand/20" />
        
        {/* Middle Spinning Dashed Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute inset-[-6px] rounded-full border-2 border-dashed border-brand/40"
        />

        {/* Inner Spinning Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-brand/80"
        />

        {/* Center Leaves with Pulse */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-brand flex items-center justify-center"
        >
          <Leaf size={48} strokeWidth={2} className="fill-brand/20 -ml-2 mt-2" />
          <Leaf size={32} strokeWidth={2} className="fill-brand/40 absolute ml-5 -mt-5 transform rotate-45" />
        </motion.div>
      </div>

      {text && (
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-brand/80 font-serif font-medium tracking-wide text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};
