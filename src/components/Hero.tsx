"use client";

import { useEffect, useRef } from "react";
import GlassCard from "./GlassCard";
import StatCard from "./StatCard";
import { IconBeads, IconBook, IconClock, IconMail } from "./IconCMYK";

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
      
      {/* ═══ BACKGROUND CMYK ISLAMIQUE ═══ */}
      <div ref={bgRef} className="absolute inset-0 z-0 pointer-events-none">
        
        {/* Dégradé CMYK */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #0A2E2E 0%, #1A4A4A 25%, #2D6A6A 50%, #00A8A8 75%, #40C0C0 100%)"
          }}
        />
        
        {/* Motif gouttes CMYK */}
        <div className="absolute inset-0 pattern-cmyk-drops" />
        
        {/* Motif gouttes vertes */}
        <div 
          className="absolute inset-0 pattern-green-drops"
          style={{ mixBlendMode: "overlay", opacity: 0.6 }}
        />
        
        {/* Motif hexagone */}
        <div 
          className="absolute inset-0 pattern-cmyk-hex"
          style={{ opacity: 0.3 }}
        />
        
        {/* Lignes subtils */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(0,168,168,0.02) 40px,
              rgba(0,168,168,0.02) 80px
            )`
          }}
        />
        
        {/* Glow cyan */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 30% 40%, rgba(0,168,168,0.08) 0%, transparent 50%)"
          }}
        />
        
        {/* Glow magenta */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 70% 60%, rgba(139,46,90,0.06) 0%, transparent 50%)"
          }}
        />
        
        {/* Glow or */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 80%, rgba(212,168,67,0.05) 0%, transparent 50%)"
          }}
        />
        
        {/* Vignette */}
        <div className="absolute inset-0 vignette-overlay" />
      </div>  

      {/* Content */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-32 overflow-x-hidden">

        {/* Badge */}
        <div className="flex justify-center mb-7 animate-slideUp delay-200">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E8C878] px-5 py-2 rounded-full
            bg-[rgba(0,168,168,0.15)] border border-[rgba(212,168,67,0.3)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#D4A843] animate-pulse" />
            Montmagny, Québec — Canada
          </span>
        </div>

        {/* Title */}
        <div className="text-center mb-10 animate-slideUp delay-300">
          <h1 className="font-black leading-none tracking-tight text-white mb-2 hero-title-glow"
            style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)" }}>
            Centre Culturel Islamique
          </h1>
          <h2 className="font-black leading-none tracking-tight text-[#D4A843] hero-title-glow-gold"
            style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)" }}>
            de Montmagny
          </h2>
        </div>

        {/* Two Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-10 animate-slideUp delay-400 max-w-4xl mx-auto">
          
          {/* ═══ HADITH CARD ═══ */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl
                bg-[rgba(0,168,168,0.2)] border border-[rgba(212,168,67,0.3)]">
                <IconBeads className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-black text-sm">Hadith</div>
                <div className="text-[#E8C878]/60 text-xs">Du quotidien</div>
              </div>
            </div>
            <p className="text-right leading-loose mb-3 text-[1.05rem]" dir="rtl"
              style={{ color: "#E8C878", fontFamily: "var(--font-arabic, serif)" }}>
              وَالَّذِي نَفْسِي بِيَدِهِ، لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ
            </p>
            <div className="gold-divider mb-3" />
            <p className="text-white/60 text-xs italic leading-relaxed">
              « Par Celui qui détient mon âme ! Nul d&apos;entre vous n&apos; a la foi parfaite tant qu&apos;il n&apos;aime pas pour son frère ce qu&apos;il aime pour lui-même. »
            </p>
          </GlassCard>

          {/* ═══ QURAN CARD ═══ */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl
                bg-[rgba(0,168,168,0.2)] border border-[rgba(212,168,67,0.3)]">
                <IconBook className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-black text-sm">Sourate Al-Baqara</div>
                <div className="text-[#E8C878]/60 text-xs">Coran 2:238</div>
              </div>
            </div>
            <p className="text-right leading-loose mb-3 text-[1.05rem]" dir="rtl"
              style={{ color: "#E8C878", fontFamily: "var(--font-arabic, serif)" }}>
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
          <a href="#horaires" className="btn-primary flex items-center gap-2" style={{ 
            background: "linear-gradient(135deg, #00A8A8, #40C0C0)",
            boxShadow: "0 6px 24px rgba(0,168,168,0.5)" 
          }}>
            <IconClock className="w-5 h-5" />
            Horaires des Prières
          </a>
          <a href="#contact" className="btn-secondary flex items-center gap-2" style={{
            border: "1px solid rgba(212,168,67,0.4)",
            color: "#E8C878"
          }}>
            <IconMail className="w-5 h-5" />
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

      {/* ═══ VAGUE CMYK EN BAS ═══ */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full h-auto"
          style={{ minHeight: "80px" }}
        >
          <path 
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1350,30 1440,60 L1440,120 L0,120 Z" 
            fill="#e0ebe842"
          />
        </svg>
      </div>

      {/* Scroll Indicator */}
      <a href="#horaires" className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 text-white/30 hover:text-white/70 transition-colors animate-bounce">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
}