"use client";

import { useEffect, useRef } from "react";
import GlassCard from "./GlassCard";
import StatCard from "./StatCard";
import WaveDivider from "./WaveDivider";

const STATS = [
  { n: "5", l: "Prières / jour" },
  { n: "7j", l: "Ouvert" },
  { n: "∞", l: "Fraternité" },
];

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <section id="accueil" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <div className="hero-gradient absolute inset-0" />
        <div className="pattern-overlay pattern-hex" />
        <div className="radial-glow absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-24">

        {/* Badge */}
        <div className="flex justify-center mb-7 animate-slideUp delay-200">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200 px-5 py-2 rounded-full
            bg-white/[0.07] border border-[var(--theme-border-gold)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Montmagny, Québec — Canada
          </span>
        </div>

        {/* Title avec effet lumière subtil SANS CADRE */}
        <div className="text-center mb-10 animate-slideUp delay-300">
          <h1 className="font-black leading-none tracking-tight text-white mb-2 hero-title-glow"
            style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)" }}>
            Centre Culturel Islamique
          </h1>
          <h2 className="font-black leading-none tracking-tight text-gold-gradient hero-title-glow-gold"
            style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)" }}>
            de Montmagny
          </h2>
        </div>

        {/* Two Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-10 animate-slideUp delay-400">
          
          {/* Hadith Card */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl
                bg-[rgba(197,160,89,0.2)] border border-[var(--theme-border-gold)]">
                📿
              </div>
              <div>
                <div className="text-white font-black text-sm">Hadith</div>
                <div className="text-[var(--theme-gold-light)]/60 text-xs">Du quotidien</div>
              </div>
            </div>
            <p className="text-right leading-loose mb-3 text-lg" dir="rtl"
              style={{ color: "var(--theme-gold-light)", fontFamily: "var(--font-arabic, serif)" }}>
              وَالَّذِي نَفْسِي بِيَدِهِ، لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ
            </p>
            <div className="gold-divider mb-3" />
            <p className="text-white/60 text-xs italic leading-relaxed">
              « Par Celui qui détient mon âme ! Nul d&apos;entre vous n&apos; a la foi parfaite tant qu&apos;il n&apos;aime pas pour son frère ce qu&apos;il aime pour lui-même. »
            </p>
          </GlassCard>

          {/* Quran Card */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl
                bg-[rgba(197,160,89,0.2)] border border-[var(--theme-border-gold)]">
                📖
              </div>
              <div>
                <div className="text-white font-black text-sm">Sourate Al-Baqara</div>
                <div className="text-[var(--theme-gold-light)]/60 text-xs">Coran 2:238</div>
              </div>
            </div>
            <p className="text-right leading-loose mb-3 text-[1.05rem]" dir="rtl"
              style={{ color: "var(--theme-gold-light)", fontFamily: "var(--font-arabic, serif)" }}>
              حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ
            </p>
            <div className="gold-divider mb-3" />
            <p className="text-white/60 text-xs italic leading-relaxed">
              « Veillez sur vos prières, et surtout sur la prière du milieu, et tenez-vous debout devant Allah avec dévotion. »
            </p>
          </GlassCard>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14 animate-slideUp delay-500">
          <a href="#horaires" className="btn-primary" style={{ boxShadow: "0 6px 24px var(--theme-btn-shadow)" }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Horaires des Prières
          </a>
          <a href="#contact" className="btn-secondary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Nous contacter
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto animate-fadeIn delay-700">
          {STATS.map((s) => (
            <StatCard key={s.l} number={s.n} label={s.l} />
          ))}
        </div>
      </div>

      {/* Wave Transition */}
      <WaveDivider fill="var(--theme-bg-body)" height={80} className="absolute bottom-0 left-0 right-0" />

      {/* Scroll Indicator */}
      <a href="#horaires" className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 text-white/30 hover:text-white/70 transition-colors animate-bounce">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
}