"use client";

import { ReactNode } from "react";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  alt?: boolean;
  fullWidth?: boolean;
}

export default function SectionWrapper({
  id,
  children,
  className = "",
  alt = false,
  fullWidth = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`
        relative
        ${alt ? "section-alt" : ""}
        ${fullWidth ? "" : "py-16 md:py-24"}
        ${className}
      `}
    >
      <div className={fullWidth ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        {children}
      </div>
    </section>
  );
}