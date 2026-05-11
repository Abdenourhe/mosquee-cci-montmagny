"use client";

import { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  icon?: string;
  variant?: "light" | "medium" | "dark" | "gradient";
  className?: string;
}

export default function SectionLabel({
  children,
  icon,
  variant = "medium",
  className = "",
}: SectionLabelProps) {
  const variants = {
    light: "bg-[var(--theme-primary)]/8 text-[var(--theme-primary)] border-[var(--theme-primary)]/15",
    medium: "bg-[var(--theme-primary)]/15 text-[var(--theme-primary-dark)] border-[var(--theme-primary)]/25",
    dark: "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)]",
    gradient: "text-white border-white/20 bg-gradient-to-r from-[var(--theme-primary-dark)] via-[var(--theme-primary)] to-[var(--theme-primary-light)]",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.15em]
        border backdrop-blur-sm shadow-sm
        relative overflow-hidden
        ${variants[variant]}
        ${className}
      `}
    >
      {/* Shimmer effect */}
      <span 
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        }}
      />
      
      {icon && <span className="text-sm relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </span>
  );
}