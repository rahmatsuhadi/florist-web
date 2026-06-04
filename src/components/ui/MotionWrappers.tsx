"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import type React from "react";
import { fadeInUp, staggerContainer } from "@/constants/animations";

interface WrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export const FadeInUpWrapper = ({ children, className, ...props }: WrapperProps) => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StaggerWrapper = ({ children, className, ...props }: WrapperProps) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const FadeInWrapper = ({ children, className, ...props }: WrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CustomMotionWrapper = ({ children, ...props }: WrapperProps) => {
  return <motion.div {...props}>{children}</motion.div>;
};
