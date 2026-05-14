"use client";

import { useEffect, useState } from "react";

type Mode = "normal" | "ramadan" | "eid_fitr" | "eid_adha";

const THEMES: Record<Mode, { bg: string; text: string; arabic: string; subtitle: string; emoji: string; decoration: string[] } | null> = {
  normal: null,
  ramadan: {
    bg:         "linear-gradient(135deg, #064446 0%, #0D7377 50%, #095457 100%)",
    text:       "رمضان مبارك",
    arabic:     "Ramadan Moubarak",
    subtitle:   "Que ce mois béni vous apporte paix, pardon et abondance",
    emoji:      "🌙",
    decoration: ["🌙","✨","🌟","⭐","🌙"],
  },
  eid_fitr: {
    bg:         "linear-gradient(135deg, #92400E 0%, #C5A059 50%, #D4B577 100%)",
    text:       "عيد الفطر مبارك",
    arabic:     "Aïd el-Fitr Moubarak",
    subtitle:   "Que l&apos;ah Aïd vous apporte joie, bonheur et bénédictions",
    emoji:      "🎉",
    decoration: ["🎊","🌟","🎉","✨","🎊"],
  },
  eid_adha: {
    bg:         "linear-gradient(135deg, #78350F 0%, #B45309 50%, #92400E 100%)",
    text:       "عيد الأضحى مبارك",
    arabic:     "Aïd el-Adha Moubarak",
    subtitle:   "Que le sacrifice d&apos;ah Ibrahim (AS) nous inspire dévotion et générosité",
    emoji:      "🐑",
    decoration: ["🐑","🌿","🕌","🌿","🐑"],
  },
};

export default function SiteModeBanner() {
  const [mode, setMode] = useState<Mode>("normal");

  useEffect(() => {
    fetch("/api/site-mode")
      .then((r) => r.json())
      .then((d) => setMode((d.mode as Mode) ?? "normal"))
      .catch(() => {});
  }, []);

  const theme = THEMES[mode];
  if (!theme) return null;

  return (
    <div className="w-full py-4 px-4 text-center relative overflow-hidden" style={{ background: theme.bg }}>
      {/* Décoration de fond */}
      <div className="absolute inset-0 flex items-center justify-around opacity-10 text-4xl pointer-events-none select-none">
        {theme.decoration.map((d, i) => <span key={i}>{d}</span>)}
      </div>

      {/* Contenu */}
      <div className="relative z-10">
        <div className="text-3xl mb-1">{theme.emoji}</div>
        <p
          className="text-2xl md:text-3xl font-black text-white mb-1"
          style={{ fontFamily: "var(--font-arabic, serif)", textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}
        >
          {theme.text}
        </p>
        <p className="text-white/90 font-bold text-sm md:text-base">{theme.arabic}</p>
        <p className="text-white/70 text-xs md:text-sm mt-1">{theme.subtitle}</p>
      </div>
    </div>
  );
}
