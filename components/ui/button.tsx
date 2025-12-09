"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",

          // Variant styles
          variant === "default" &&
            "bg-orange-600 text-white hover:bg-orange-700",
          variant === "outline" &&
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
          variant === "ghost" && "bg-transparent hover:bg-gray-100",
          variant === "destructive" &&
            "bg-red-600 text-white hover:bg-red-700",

          // Size styles
          size === "default" && "px-4 py-2 text-sm",
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "lg" && "px-5 py-3 text-base",
          size === "icon" && "p-2",

          // Full width option
          fullWidth && "w-full",

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
