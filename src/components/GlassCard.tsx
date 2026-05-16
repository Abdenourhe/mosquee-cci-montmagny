"use client";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
  return (
    <div 
      className={`rounded-2xl p-6 relative overflow-hidden transition-all duration-500 ${hover ? 'hover:scale-[1.02] hover:shadow-[0_16px_48px_rgba(0,168,168,0.2)]' : ''} ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(10, 46, 46, 0.75) 0%, rgba(26, 74, 74, 0.65) 100%)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        border: "1px solid rgba(0, 168, 168, 0.25)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Reflet subtil en haut */}
      <div 
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }}
      />
      {children}
    </div>
  );
}