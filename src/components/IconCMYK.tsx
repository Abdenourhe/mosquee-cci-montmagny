"use client";

// ═══════════════════════════════════════════
// ICONES SVG CMYK ISLAMIQUE
// ═══════════════════════════════════════════

export function IconSun({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" fill="#00A8A8" fillOpacity="0.3" stroke="#00A8A8" strokeWidth="1.5"/>
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" 
        stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconMoon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
        fill="#8B2E5A" fillOpacity="0.2" stroke="#8B2E5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18" cy="5" r="1" fill="#D4A843"/>
      <circle cx="20" cy="8" r="0.5" fill="#D4A843"/>
    </svg>
  );
}

export function IconStar({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
        fill="#D4A843" fillOpacity="0.2" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconSheep({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="14" rx="6" ry="4" fill="#00A8A8" fillOpacity="0.2" stroke="#00A8A8" strokeWidth="1.5"/>
      <circle cx="18" cy="12" r="2.5" fill="#006666" fillOpacity="0.3" stroke="#006666" strokeWidth="1.5"/>
      <path d="M19.5 10.5c0.5-1 1.5-1.5 2-1M16.5 10.5c-0.5-1-1.5-1.5-2-1" 
        stroke="#D4A843" strokeWidth="1" strokeLinecap="round"/>
      <path d="M9 18v3M12 18v3M15 18v3" stroke="#1A2A2A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconPrayer({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="6" r="3" fill="#8B2E5A" fillOpacity="0.2" stroke="#8B2E5A" strokeWidth="1.5"/>
      <path d="M8 14c0-2.21 1.79-4 4-4s4 1.79 4 4v6H8v-6z" 
        fill="#8B2E5A" fillOpacity="0.1" stroke="#8B2E5A" strokeWidth="1.5"/>
      <path d="M10 12l2-2 2 2M12 10v4" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="10" stroke="#D4A843" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3"/>
    </svg>
  );
}

export function IconBook({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#00A8A8" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" 
        fill="#00A8A8" fillOpacity="0.1" stroke="#00A8A8" strokeWidth="1.5"/>
      <path d="M8 6h8M8 10h8M8 14h5" stroke="#D4A843" strokeWidth="1" strokeLinecap="round"/>
      <path d="M16 2v6l2-2 2 2V2" fill="#D4A843" fillOpacity="0.3" stroke="#D4A843" strokeWidth="1"/>
    </svg>
  );
}

export function IconBeads({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="4" r="2" fill="#00A8A8" stroke="#00A8A8" strokeWidth="1"/>
      <circle cx="7" cy="7" r="2" fill="#8B2E5A" stroke="#8B2E5A" strokeWidth="1"/>
      <circle cx="17" cy="7" r="2" fill="#D4A843" stroke="#D4A843" strokeWidth="1"/>
      <circle cx="5" cy="12" r="2" fill="#00A8A8" stroke="#00A8A8" strokeWidth="1"/>
      <circle cx="19" cy="12" r="2" fill="#D4A843" stroke="#D4A843" strokeWidth="1"/>
      <circle cx="7" cy="17" r="2" fill="#8B2E5A" stroke="#8B2E5A" strokeWidth="1"/>
      <circle cx="17" cy="17" r="2" fill="#00A8A8" stroke="#00A8A8" strokeWidth="1"/>
      <path d="M12 6v1M7 9v1M17 9v1M5 14v1M19 14v1M7 19v1M17 19v1" 
        stroke="#1A2A2A" strokeWidth="0.5"/>
    </svg>
  );
}

export function IconClock({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="#00A8A8" fillOpacity="0.1" stroke="#00A8A8" strokeWidth="1.5"/>
      <path d="M12 7v5l3 3" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="5" r="0.5" fill="#8B2E5A"/>
      <circle cx="12" cy="19" r="0.5" fill="#8B2E5A"/>
      <circle cx="5" cy="12" r="0.5" fill="#8B2E5A"/>
      <circle cx="19" cy="12" r="0.5" fill="#8B2E5A"/>
    </svg>
  );
}

export function IconMail({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="#00A8A8" fillOpacity="0.1" stroke="#00A8A8" strokeWidth="1.5"/>
      <path d="M3 7l9 6 9-6" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconCommunity({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="6" r="2.5" fill="#00A8A8" fillOpacity="0.3" stroke="#00A8A8" strokeWidth="1.5"/>
      <circle cx="6" cy="10" r="2.5" fill="#8B2E5A" fillOpacity="0.3" stroke="#8B2E5A" strokeWidth="1.5"/>
      <circle cx="18" cy="10" r="2.5" fill="#D4A843" fillOpacity="0.3" stroke="#D4A843" strokeWidth="1.5"/>
      <path d="M9 21v-4a3 3 0 016 0v4M3 21v-3a3 3 0 016 0v1M15 21v-1a3 3 0 016 0v3" 
        stroke="#1A2A2A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconHealth({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" 
        fill="#8B2E5A" fillOpacity="0.2" stroke="#8B2E5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 6v8M8 12h8" stroke="#00A8A8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconShield({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
        fill="#00A8A8" fillOpacity="0.1" stroke="#00A8A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8l1.5 3 3 0.5-2.5 2 1 3.5L12 15.5 9.5 17l1-3.5L8 11.5l3-0.5z" 
        fill="#D4A843" fillOpacity="0.3" stroke="#D4A843" strokeWidth="1"/>
    </svg>
  );
}