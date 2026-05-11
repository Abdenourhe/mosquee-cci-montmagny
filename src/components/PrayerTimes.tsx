"use client";

import GlassCard from "./GlassCard";

export default function PrayerTimes() {
  return (
    <div className="space-y-8">

      {/* ── Widget Desktop ── */}
      <GlassCard className="overflow-hidden !p-0 !border-[rgba(13,115,119,0.2)]" hover={false}>
        <div className="px-5 py-3 flex items-center gap-3 hero-gradient border-b border-[var(--theme-border-gold)]">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-white/80 text-xs font-semibold tracking-wide uppercase">
            Mawaqit · CCI De Montmagny · G5V 1J9
          </span>
        </div>
        <div className="hidden sm:block h-[540px]">
          <iframe
            src="//mawaqit.net/fr/w/cci-de-montmagny-qc-g5v-1j9-canada?showOnly5PrayerTimes=0"
            scrolling="no"
            className="w-full h-full block border-none"
            title="Horaires des prieres CCI Montmagny"
          />
        </div>
      </GlassCard>

      {/* ── Widget Mobile ── */}
      <GlassCard className="sm:hidden overflow-hidden !p-0 !border-[rgba(13,115,119,0.2)]" hover={false}>
        <div className="px-4 py-2.5 flex items-center gap-2 hero-gradient border-b border-[var(--theme-border-gold)]">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-white/80 text-xs font-semibold">
            Mawaqit · CCI De Montmagny
          </span>
        </div>
        <div className="h-[700px]">
          <iframe
            src="//mawaqit.net/fr/m/cci-de-montmagny-qc-g5v-1j9-canada?showNotification=0&showSearchButton=0&showFooter=0&showFlashMessage=0&view=mobile"
            scrolling="no"
            className="w-full h-full block border-none"
            title="Horaires des prieres mobile CCI Montmagny"
          />
        </div>
      </GlassCard>

      {/* ── Jumaa Banner ── */}
      <div className="rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6
        hero-gradient border border-[var(--theme-border-gold)]">
        
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl bg-white/10 flex-shrink-0">
          🕌
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <div className="text-white font-black text-xl mb-1">
            Prière du Vendredi — Salat al-Jum'ah
          </div>
          <div className="text-white/60 text-sm mb-4">
            Chaque vendredi à la mosquée CCI De Montmagny
          </div>
          
          {/* Verset complet Sourate Al-Jumu'ah 62:9 */}
          <div className="space-y-3">
            <p
              className="text-xl md:text-2xl leading-loose text-right"
              dir="rtl"
              style={{ 
                color: "var(--theme-gold-light)", 
                fontFamily: "var(--font-arabic, serif)",
                textShadow: "0 2px 10px rgba(197,160,89,0.2)"
              }}
            >
              يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ ۚ ذَٰلِكُمْ خَيْرٌ لَّكُمْ إِن كُنتُمْ تَعْلَمُونَ
            </p>
            <div className="gold-divider" />
            <p className="text-white/60 text-sm italic leading-relaxed">
              « Ô vous qui croyez ! Quand on appelle à la prière du jour du vendredi, accourez au rappel d'Allah et cessez tout commerce. Cela est meilleur pour vous, si vous saviez. »
            </p>
            <p className="text-white/40 text-xs">
              — Sourate Al-Jumu'ah (62:9)
            </p>
          </div>
        </div>
        
        {/* Badge Jum'ah */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center
            bg-[rgba(197,160,89,0.15)] border border-[var(--theme-border-gold)]">
            <svg className="w-7 h-7 text-[var(--theme-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">
            Jum'ah
          </span>
        </div>
      </div>
    </div>
  );
}