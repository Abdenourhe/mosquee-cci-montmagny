"use client";
import { useEffect, useState, useCallback } from "react";

interface Inv { 
  id: string; 
  label: string; 
  arabic: string; 
  french: string; 
  side: string; 
}

function InvocationCard({ inv, visible }: { inv: Inv; visible: boolean }) {
  if (!visible) return null;

  return (
    <div 
      className="w-[320px] rounded-xl overflow-hidden shadow-2xl mb-4"
      style={{
        background: "linear-gradient(145deg, #0a1f1f, #051414)",
        border: "1px solid rgba(197, 160, 89, 0.3)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(197,160,89,0.1)",
      }}
    >
      {/* ─── HEADER ─── */}
      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-[#C5A059]/20">
        <span className="text-lg">🤲</span>
        <span className="text-[#FCD34D] text-xs font-bold uppercase tracking-wide">
          {inv.label}
        </span>
      </div>

      {/* ─── ARABE (lisibilité maximale) ─── */}
      <div className="px-4 py-3 bg-black/20">
        <p 
          dir="rtl" 
          className="text-right text-[#FCD34D] font-bold leading-[2.2]"
          style={{
            fontSize: "1.15rem",           // ← PLUS GRAND
            fontFamily: "'Amiri', 'Scheherazade New', 'Traditional Arabic', serif", // ← POLICE ARABE
            textShadow: "0 0 10px rgba(252,211,77,0.15)",
            wordSpacing: "0.05em",         // ← ESPACEMENT MOTS
          }}
        >
          {inv.arabic}
        </p>
      </div>

      {/* ─── SÉPARATEUR ─── */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />

      {/* ─── FRANÇAIS ─── */}
      <div className="px-4 py-2.5">
        <p 
          className="text-white/80 text-[13px] leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {inv.french}
        </p>
      </div>
    </div>
  );
}

export default function SideInvocations() {
  const [left, setLeft] = useState<Inv[]>([]);
  const [right, setRight] = useState<Inv[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(0);
  const [leftVis, setLeftVis] = useState(true);
  const [rightVis, setRightVis] = useState(true);

  useEffect(() => {
    fetch("/api/site-mode").then(r=>r.json())
      .then(d=>{ if(d.invocationsActive===false) setEnabled(false); }).catch(()=>{});
    fetch("/api/invocations").then(r=>r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const active = data.filter((i) => i.active !== false);
        setLeft(active.filter((i) => i.side === "left"));
        setRight(active.filter((i) => i.side === "right"));
      }).catch(()=>{});
  }, []);

  const rotateLeft = useCallback(() => {
    setLeftVis(false);
    setTimeout(() => { setLeftIdx(p => (p+1) % Math.max(1,left.length)); setLeftVis(true); }, 600);
  }, [left.length]);

  const rotateRight = useCallback(() => {
    setRightVis(false);
    setTimeout(() => { setRightIdx(p => (p+1) % Math.max(1,right.length)); setRightVis(true); }, 600);
  }, [right.length]);

  useEffect(() => {
    if (!enabled || left.length <= 1) return;
    const id = setInterval(rotateLeft, 10000);
    return () => clearInterval(id);
  }, [enabled, left.length, rotateLeft]);

  useEffect(() => {
    if (!enabled || right.length <= 1) return;
    const t = setTimeout(() => {
      const id = setInterval(rotateRight, 10000);
      return () => clearInterval(id);
    }, 5000);
    return () => clearTimeout(t);
  }, [enabled, right.length, rotateRight]);

  if (!enabled || (left.length === 0 && right.length === 0)) return null;

  return (
    <>
      {/* Côté GAUCHE */}
      {left.length > 0 && (
        <div className="fixed z-30 hidden xl:flex flex-col" style={{ left: 16, top: "50%", transform: "translateY(-50%)" }}>
          <div style={{ opacity: leftVis ? 1 : 0, transform: leftVis ? "translateX(0)" : "translateX(-20px)", transition: "all 0.6s ease" }}>
            <InvocationCard inv={left[leftIdx]} visible={true} />
          </div>
          {/* Indicateurs */}
          <div className="flex gap-1.5 mt-2 justify-start">
            {left.map((_, i) => (
              <div key={i} className="h-1.5 rounded-full transition-all duration-300" 
                style={{ width: i === leftIdx ? 20 : 6, backgroundColor: i === leftIdx ? "#C5A059" : "rgba(197,160,89,0.2)" }} />
            ))}
          </div>
        </div>
      )}

      {/* Côté DROIT */}
      {right.length > 0 && (
        <div className="fixed z-30 hidden xl:flex flex-col items-end" style={{ right: 16, top: "50%", transform: "translateY(-50%)" }}>
          <div style={{ opacity: rightVis ? 1 : 0, transform: rightVis ? "translateX(0)" : "translateX(20px)", transition: "all 0.6s ease" }}>
            <InvocationCard inv={right[rightIdx]} visible={true} />
          </div>
          <div className="flex gap-1.5 mt-2 justify-end">
            {right.map((_, i) => (
              <div key={i} className="h-1.5 rounded-full transition-all duration-300" 
                style={{ width: i === rightIdx ? 20 : 6, backgroundColor: i === rightIdx ? "#C5A059" : "rgba(197,160,89,0.2)" }} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}