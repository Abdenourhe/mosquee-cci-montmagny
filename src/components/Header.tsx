"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#horaires",  label: "Prières" },
  { href: "#annonces",  label: "Annonces" },
  { href: "#apropos",   label: "À propos" },
  { href: "#activites", label: "Activités" },
  { href: "#don",       label: "Don" },
  { href: "#contact",   label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastY, setLastY]       = useState(0);
  const [visible, setVisible]   = useState(true);

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setVisible(y < 80 || y < lastY);
      setLastY(y);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [lastY]);

  const headerBg = scrolled
    ? "bg-[rgba(3,31,32,0.88)] backdrop-blur-[18px] saturate-150 shadow-[0_2px_24px_rgba(0,0,0,0.35)] border-b border-[rgba(197,160,89,0.18)]"
    : "bg-transparent";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
      style={{ transform: visible ? "translateY(0)" : "translateY(-110%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white shadow-lg flex-shrink-0">
              <Image src="/ccimontmagny_logo.png" alt="CCI Montmagny" fill className="object-contain p-0.5" />
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-black text-sm leading-tight tracking-wide">CCI DE MONTMAGNY</div>
              <div className="text-xs font-medium text-[var(--theme-gold-light)]">Centre Culturel Islamique</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-white/75 hover:text-white hover:bg-white/10 transition-all">
                {link.label}
              </a>
            ))}
            <Link href="/admin"
              className="ml-3 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5
                bg-[rgba(197,160,89,0.18)] border border-[rgba(197,160,89,0.45)] text-[var(--theme-gold-light)]">
              ⚙ Admin
            </Link>
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-[rgba(197,160,89,0.2)] bg-[rgba(3,31,32,0.97)]">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-white/75 hover:text-white hover:bg-white/10 transition-all">
                {link.label}
              </a>
            ))}
            <Link href="/admin" onClick={() => setMenuOpen(false)}
              className="mt-2 px-4 py-3 rounded-xl text-sm font-bold text-center transition-all
                bg-[rgba(197,160,89,0.15)] border border-[rgba(197,160,89,0.4)] text-[var(--theme-gold-light)]">
              ⚙ Espace Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
