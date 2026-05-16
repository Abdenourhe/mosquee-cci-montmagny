"use client";

interface StatCardProps {
  number: string;
  label: string;
  className?: string;
}

export default function StatCard({ number, label, className = "" }: StatCardProps) {
  return (
    <div 
      className={`rounded-2xl py-4 px-2 text-center ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(10, 46, 46, 0.6) 0%, rgba(26, 74, 74, 0.5) 100%)",
        backdropFilter: "blur(20px) saturate(150%)",
        border: "1px solid rgba(0, 168, 168, 0.2)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div className="text-2xl font-black" style={{ color: "#D4A843" }}>
        {number}
      </div>
      <div className="text-white/50 text-xs mt-1">{label}</div>
    </div>
  );
}