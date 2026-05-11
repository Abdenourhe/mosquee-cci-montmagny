"use client";

interface SectionDividerProps {
  variant?: "wave" | "gradient" | "line" | "dots" | "islamic";
  flip?: boolean;
  height?: number;
  className?: string;
}

export default function SectionDivider({
  variant = "wave",
  flip = false,
  height = 80,
  className = "",
}: SectionDividerProps) {
  
  const flipClass = flip ? "rotate-180" : "";
  
  // ── Wave ──
  if (variant === "wave") {
    return (
      <div className={`w-full overflow-hidden leading-[0] ${flipClass} ${className}`} style={{ height }}>
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="block h-full w-full"
        >
          <path
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
            fill="var(--theme-bg-body, #F8F6F1)"
          />
          <path
            d="M0,80 C360,40 720,100 1080,40 C1260,20 1380,60 1440,80 L1440,120 L0,120 Z"
            fill="var(--theme-section-alt, #F0EDE6)"
            opacity="0.5"
          />
        </svg>
      </div>
    );
  }
  
  // ── Gradient fade ──
  if (variant === "gradient") {
    return (
      <div 
        className={`w-full ${flipClass} ${className}`}
        style={{ 
          height,
          background: "linear-gradient(to bottom, var(--theme-section-alt, #F0EDE6), var(--theme-bg-body, #F8F6F1))"
        }}
      />
    );
  }
  
  // ── Elegant line with diamond ──
  if (variant === "line") {
    return (
      <div className={`w-full flex items-center justify-center py-8 ${className}`}>
        <div className="flex items-center gap-4 max-w-md w-full px-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--theme-primary)]/30 to-[var(--theme-primary)]/60" />
          <div className="w-3 h-3 rotate-45 bg-[var(--theme-gold)] shadow-[0_0_12px_rgba(197,160,89,0.4)]" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[var(--theme-primary)]/30 to-[var(--theme-primary)]/60" />
        </div>
      </div>
    );
  }
  
  // ── Dots pattern ──
  if (variant === "dots") {
    return (
      <div className={`w-full flex items-center justify-center py-6 ${className}`}>
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === 2 ? 10 : 6,
                height: i === 2 ? 10 : 6,
                backgroundColor: i === 2 ? "var(--theme-gold)" : "var(--theme-primary)",
                opacity: i === 2 ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>
    );
  }
  
  // ── Islamic geometric ──
  if (variant === "islamic") {
    return (
      <div className={`w-full flex items-center justify-center py-6 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[var(--theme-primary)]/40" />
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" 
              stroke="var(--theme-gold)" strokeWidth="1" fill="none"/>
            <polygon points="16,8 26,13 26,21 16,26 6,21 6,13" 
              stroke="var(--theme-primary)" strokeWidth="0.8" fill="none" opacity="0.6"/>
            <circle cx="16" cy="16" r="3" 
              stroke="var(--theme-gold)" strokeWidth="0.8" fill="none"/>
          </svg>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[var(--theme-primary)]/40" />
        </div>
      </div>
    );
  }
  
  return null;
}