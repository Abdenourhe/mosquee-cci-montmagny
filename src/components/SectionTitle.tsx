"use client";

import { ReactNode } from "react";
import SectionLabel from "./SectionLabel";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  label?: string;
  labelIcon?: string;
  labelVariant?: "light" | "medium" | "dark" | "gradient";
  centered?: boolean;
  light?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function SectionTitle({
  title,
  subtitle,
  label,
  labelIcon,
  labelVariant = "medium",
  centered = true,
  light = false,
  className = "",
  children,
}: SectionTitleProps) {
  const subColor = light ? "text-white/50" : "text-[var(--theme-primary)]/70";

  return (
    <div className={`mb-12 ${centered ? "text-center" : ""} ${className}`}>
      {/* Label optionnel - arrondi pill */}
      {label && (
        <div className="mb-5">
          <SectionLabel icon={labelIcon} variant={labelVariant}>
            {label}
          </SectionLabel>
        </div>
      )}

      {/* Titre principal avec dégradé vert */}
      <h2
        className={`
          text-3xl md:text-4xl lg:text-5xl font-black tracking-tight
          ${light ? "text-white" : "bg-gradient-to-r from-[var(--theme-primary-dark)] via-[var(--theme-primary)] to-[var(--theme-primary-light)] bg-clip-text text-transparent"}
          relative inline-block
        `}
      >
        {title}
        {/* Soulignement vert dégradé */}
        <span
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 rounded-full"
          style={{
            width: "50%",
            background: "linear-gradient(90deg, transparent, var(--theme-primary), var(--theme-primary-light), transparent)",
          }}
        />
      </h2>

      {/* Sous-titre */}
      {subtitle && (
        <p className={`mt-4 text-sm md:text-base font-medium max-w-2xl ${centered ? "mx-auto" : ""} ${subColor}`}>
          {subtitle}
        </p>
      )}

      {/* Contenu additionnel */}
      {children}
    </div>
  );
}