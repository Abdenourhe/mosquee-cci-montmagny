"use client";

interface WaveDividerProps {
  fill?: string;
  height?: number;
  flip?: boolean;
  className?: string;
}

export default function WaveDivider({
  fill = "var(--theme-bg-body, #F5F5F0)",
  height = 60,
  flip = false,
  className = "",
}: WaveDividerProps) {
  return (
    <div
      className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}
      style={{ height }}
    >
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        <path
          d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}