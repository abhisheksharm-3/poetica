import React from "react";
import { motion } from "framer-motion";
import { pulseVariant } from "@/utils/animations";

export const PoemLoadingSkeleton = () => {
  return (
    <motion.div
      variants={pulseVariant}
      animate="animate"
      className="space-y-4 w-full"
    >
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-5/6" />
      <div className="h-4 bg-muted rounded w-4/5" />
      <div className="space-y-2 pt-4">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-11/12" />
        <div className="h-4 bg-muted rounded w-4/5" />
      </div>
      <div className="space-y-2 pt-4">
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
    </motion.div>
  );
};

export const CardLoadingSkeleton = () => {
  return (
    <motion.div
      variants={pulseVariant}
      animate="animate"
      className="space-y-4 w-full p-6 border rounded-lg"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
        <div className="h-8 w-8 bg-muted rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/5" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-muted rounded-full w-20" />
        <div className="h-6 bg-muted rounded-full w-24" />
        <div className="h-6 bg-muted rounded-full w-16" />
      </div>
    </motion.div>
  );
};

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export const PageLoadingSkeleton = () => {
  return (
    <div className="container mx-auto px-4 max-w-5xl py-12 space-y-8">
      <motion.div variants={pulseVariant} animate="animate" className="space-y-4">
        <div className="h-12 bg-muted rounded w-1/3" />
        <div className="h-6 bg-muted rounded w-1/2" />
      </motion.div>

      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <CardLoadingSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
