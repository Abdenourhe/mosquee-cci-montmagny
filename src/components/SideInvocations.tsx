"use client";
import { useEffect, useState, useCallback } from "react";

interface Inv { 
  id: string; 
  label: string; 
  arabic: string; 
  french: string; 
  side: string; 
  category: string;
}

function LiveComment({ inv, visible, isNew }: { 
  inv: Inv; 
  visible: boolean; 
  isNew: boolean;
}) {
  const [showNew, setShowNew] = useState(isNew);
  
  useEffect(() => {
    if (isNew) {
      const t = setTimeout(() => setShowNew(false), 3000);
      return () => clearTimeout(t);
    }
  }, [isNew]);

  if (!visible) return null;

  return (
    <div className="relative mb-3 animate-in slide-in-from-bottom-2 fade-in duration-500">
      {/* Badge "Nouveau" */}
      {showNew && (
        <span className="absolute -top-1 -right-1 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
          NEW
        </span>
      )}
      
      <div 
        className="w-[260px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(13,115,119,0.95), rgba(6,30,30,0.98))",
          border: "1px solid rgba(197,160,89,0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Header avec icône et label */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
          <div 
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #C5A059, #FCD34D)" }}
          >
            🤲
          </div>
          <span className="text-[#FCD34D] text-xs font-bold truncate">
            {inv.label}
          </span>
          {inv.category !== 'daily' && (
            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60">
              {inv.category}
            </span>
          )}
        </div>

        {/* Corps */}
        <div className="px-3 py-2.5">
          {/* Arabe avec scroll si trop long */}
          <p 
            dir="rtl" 
            className="text-[#FCD34D] text-sm leading-relaxed text-right mb-1.5 font-serif"
            style={{
              maxHeight: "4.5em",
              overflow: "auto",
              scrollbarWidth: "none",
            }}
          >
            {inv.arabic}
          </p>
          
          {/* Ligne séparatrice */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent mb-1.5" />
          
          {/* Français */}
          <p className="text-white/70 text-[11px] leading-snug italic line-clamp-2">
            {inv.french}
          </p>
        </div>

        {/* Footer avec indicateur */}
        <div className="px-3 py-1 flex items-center justify-between border-t border-white/5">
          <div className="flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-1 rounded-full bg-[#C5A059]/40"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <span className="text-[9px] text-white/30">
            {inv.side === 'left' ? '◀ Gauche' : 'Droite ▶'}
          </span>
        </div>
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
  const [newLeft, setNewLeft] = useState(false);
  const [newRight, setNewRight] = useState(false);

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
    setNewLeft(true);
    setLeftIdx(p => (p+1) % Math.max(1, left.length));
    setTimeout(() => setNewLeft(false), 500);
  }, [left.length]);

  const rotateRight = useCallback(() => {
    setNewRight(true);
    setRightIdx(p => (p+1) % Math.max(1, right.length));
    setTimeout(() => setNewRight(false), 500);
  }, [right.length]);

  useEffect(() => {
    if (!enabled || left.length <= 1) return;
    const id = setInterval(rotateLeft, 8000);
    return () => clearInterval(id);
  }, [enabled, left.length, rotateLeft]);

  useEffect(() => {
    if (!enabled || right.length <= 1) return;
    const t = setTimeout(() => {
      const id = setInterval(rotateRight, 8000);
      return () => clearInterval(id);
    }, 4000);
    return () => clearTimeout(t);
  }, [enabled, right.length, rotateRight]);

  if (!enabled || (left.length === 0 && right.length === 0)) return null;

  return (
    <>
      {/* Côté GAUCHE */}
      {left.length > 0 && (
        <div className="fixed z-30 hidden xl:block"
          style={{ left: 20, bottom: 100, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          <div className="flex flex-col-reverse gap-2">
            {/* Afficher les 3 dernières invocations comme un chat */}
            {[...Array(Math.min(3, left.length))].map((_, i) => {
              const idx = (leftIdx - i + left.length) % left.length;
              return (
                <LiveComment 
                  key={left[idx].id} 
                  inv={left[idx]} 
                  visible={true}
                  isNew={i === 0 && newLeft}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Côté DROIT */}
      {right.length > 0 && (
        <div className="fixed z-30 hidden xl:block"
          style={{ right: 20, bottom: 100, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          <div className="flex flex-col-reverse gap-2">
            {[...Array(Math.min(3, right.length))].map((_, i) => {
              const idx = (rightIdx - i + right.length) % right.length;
              return (
                <LiveComment 
                  key={right[idx].id} 
                  inv={right[idx]} 
                  visible={true}
                  isNew={i === 0 && newRight}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}