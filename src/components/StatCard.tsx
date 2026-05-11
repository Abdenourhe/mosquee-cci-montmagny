"use client";

interface StatCardProps {
  number: string;
  label: string;
  className?: string;
}

export default function StatCard({ number, label, className = "" }: StatCardProps) {
  return (
    <div className={`glass-card py-4 px-2 text-center ${className}`}>
      <div className="text-2xl font-black" style={{ color: "var(--theme-gold-light)" }}>
        {number}
      </div>
      <div className="text-white/45 text-xs mt-1">{label}</div>
    </div>
  );
}