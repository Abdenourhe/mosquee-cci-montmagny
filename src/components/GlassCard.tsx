"use client";

import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  padding = "md",
}: GlassCardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
        glass-card
        ${paddingClasses[padding]}
        ${hover ? "hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}