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

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════

const CATEGORY_ICONS: Record<string, string> = {
  daily: "☀️",
  ramadan: "🌙", 
  eid_fitr: "🌟",
  eid_adha: "🐑",
  ashoura: "📿",
};

const CATEGORY_COLORS: Record<string, string> = {
  daily: "#0D7377",
  ramadan: "#7C3AED",
  eid_fitr: "#D97706", 
  eid_adha: "#059669",
  ashoura: "#DC2626",
};

// ═══════════════════════════════════════════════════════════
// COMPOSANT CARTE
// ═══════════════════════════════════════════════════════════

function InvocationCard({ 
  inv, 
  visible, 
  isNew, 
  isFocused, 
  onFocus,
  index,
  total,
}: { 
  inv: Inv; 
  visible: boolean; 
  isNew: boolean;
  isFocused: boolean;
  onFocus: () => void;
  index: number;
  total: number;
}) {
  const [showNewBadge, setShowNewBadge] = useState(isNew);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isNew) {
      const t = setTimeout(() => setShowNewBadge(false), 2500);
      return () => clearTimeout(t);
    }
  }, [isNew]);

  if (!visible) return null;

  const catColor = CATEGORY_COLORS[inv.category] || "#0D7377";
  const catIcon = CATEGORY_ICONS[inv.category] || "🤲";

  return (
    <div 
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        width: isFocused ? "380px" : "280px",
        background: "rgba(255, 255, 255, 0.72)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderTop: `2px solid ${isFocused ? catColor : "rgba(255, 255, 255, 0.6)"}`,
        borderRight: `2px solid ${isFocused ? catColor : "rgba(255, 255, 255, 0.6)"}`,
        borderBottom: `2px solid ${isFocused ? catColor : "rgba(255, 255, 255, 0.6)"}`,
        borderLeft: `4px solid ${catColor}`,
        boxShadow: isFocused 
          ? `0 16px 48px ${catColor}30, 0 4px 16px rgba(0,0,0,0.15)` 
          : "0 8px 32px rgba(13, 115, 119, 0.15), 0 2px 8px rgba(0,0,0,0.08)",
        transform: isFocused ? "scale(1.05)" : isHovered ? "scale(1.02)" : "scale(1)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: isFocused ? 50 : 1,
      }}
      onClick={onFocus}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge "NEW" */}
      {showNewBadge && (
        <span 
          className="absolute -top-1.5 -right-1.5 z-20 px-2 py-0.5 rounded-full text-[10px] font-black text-white animate-pulse"
          style={{ 
            background: `linear-gradient(135deg, ${catColor}, #14B8A6)`,
            boxShadow: `0 2px 8px ${catColor}60`,
          }}
        >
          NEW
        </span>
      )}

      {/* Numérotation */}
      <div 
        className="absolute top-2 right-2 text-[10px] font-mono font-bold"
        style={{ color: `${catColor}60` }}
      >
        {index + 1}/{total}
      </div>

      {/* ─── HEADER TRANSPARENT ─── */}
      <div className="flex items-center gap-2.5 px-3 py-2">
        <div 
          className="w-7 h-7 rounded-full flex items-center justify-center text-base flex-shrink-0"
          style={{ 
            background: `linear-gradient(135deg, ${catColor}, #14B8A6)`,
            boxShadow: `0 2px 8px ${catColor}40`,
          }}
        >
          {catIcon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[#0D7377] text-[11px] font-black uppercase tracking-wide truncate">
            {inv.label}
          </p>
          <p className="text-[#0D7377]/50 text-[9px] font-medium">
            {inv.side === 'left' ? '◀ Côté gauche' : 'Côté droit ▶'}
          </p>
        </div>
      </div>

      {/* ─── ARABE LISIBILITÉ MAX ─── */}
      <div 
        className="px-4 py-3 mx-2 my-1 rounded-lg"
        style={{ background: "rgba(2, 44, 34, 0.06)" }}
      >
        <p 
          dir="rtl" 
          className="text-right"
          style={{
            fontSize: isFocused ? "1.4rem" : "1.3rem",
            fontFamily: "var(--font-arabic)",
            fontWeight: 800,
            lineHeight: "2.4",
            color: "#022c22",
            textShadow: "0 1px 2px rgba(255,255,255,0.5)",
            wordSpacing: "0.05em",
            letterSpacing: "0.01em",
            transition: "font-size 0.3s ease",
          }}
        >
          {inv.arabic}
        </p>
      </div>

      {/* ─── SÉPARATEUR ─── */}
      <div 
        className="mx-3 h-px" 
        style={{ background: `linear-gradient(90deg, transparent, ${catColor}40, transparent)` }}
      />

      {/* ─── FRANÇAIS ─── */}
      <div className="px-3 py-2">
        <p 
          className="text-[#374151] leading-relaxed"
          style={{ 
            fontFamily: "var(--font-sans)",
            fontSize: isFocused ? "13px" : "11px",
            transition: "font-size 0.3s ease",
          }}
        >
          {inv.french}
        </p>
      </div>

      {/* ─── FOOTER ─── */}
      <div className="px-3 py-1.5 flex items-center justify-between border-t border-[#0D7377]/8">
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 h-1 rounded-full"
              style={{ 
                backgroundColor: catColor,
                opacity: 0.3 + (i * 0.25),
                animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
        <span className="text-[8px] font-medium text-[#0D7377]/40">
          CCI Montmagny
        </span>
      </div>

      {/* Overlay "Cliquez pour agrandir" sur mobile */}
      {!isFocused && (
        <div className="xl:hidden absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/5 transition-colors">
          <span className="text-[10px] text-[#0D7377]/0 hover:text-[#0D7377]/60 font-bold transition-colors">
            🔍 Agrandir
          </span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function SideInvocations() {
  const [left, setLeft] = useState<Inv[]>([]);
  const [right, setRight] = useState<Inv[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(0);
  const [leftVis, setLeftVis] = useState(true);
  const [rightVis, setRightVis] = useState(true);
  const [newLeft, setNewLeft] = useState(false);
  const [newRight, setNewRight] = useState(false);
  
  // Mode Focus
  const [focusedSide, setFocusedSide] = useState<"left" | "right" | null>(null);
  
  // Pause survol
  const [isPaused, setIsPaused] = useState(false);

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
    if (isPaused || focusedSide === "left") return;
    setNewLeft(true);
    setLeftVis(false);
    setTimeout(() => { 
      setLeftIdx(p => (p+1) % Math.max(1, left.length)); 
      setLeftVis(true);
      setTimeout(() => setNewLeft(false), 500);
    }, 500);
  }, [left.length, isPaused, focusedSide]);

  const rotateRight = useCallback(() => {
    if (isPaused || focusedSide === "right") return;
    setNewRight(true);
    setRightVis(false);
    setTimeout(() => { 
      setRightIdx(p => (p+1) % Math.max(1, right.length)); 
      setRightVis(true);
      setTimeout(() => setNewRight(false), 500);
    }, 500);
  }, [right.length, isPaused, focusedSide]);

  useEffect(() => {
    if (!enabled || left.length <= 1) return;
    const id = setInterval(rotateLeft, 15000);
    return () => clearInterval(id);
  }, [enabled, left.length, rotateLeft]);

  useEffect(() => {
    if (!enabled || right.length <= 1) return;
    const t = setTimeout(() => {
      const id = setInterval(rotateRight, 15000);
      return () => clearInterval(id);
    }, 7500);
    return () => clearTimeout(t);
  }, [enabled, right.length, rotateRight]);

  if (!enabled || (left.length === 0 && right.length === 0)) return null;

  return (
    <>
      {/* ═══ CSS INJECTÉ ═══ */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* ═══ CÔTÉ GAUCHE ═══ */}
      {left.length > 0 && (
        <div 
          className="fixed z-30 hidden xl:flex flex-col"
          style={{ 
            left: focusedSide === "left" ? "50%" : 10, 
            bottom: 140,
            transform: focusedSide === "left" ? "translateX(-50%)" : "none",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div style={{ 
            opacity: leftVis ? 1 : 0, 
            transform: leftVis ? "translateY(0)" : "translateY(20px)", 
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            <InvocationCard 
              inv={left[leftIdx]} 
              visible={true} 
              isNew={newLeft}
              isFocused={focusedSide === "left"}
              onFocus={() => setFocusedSide(focusedSide === "left" ? null : "left")}
              index={leftIdx}
              total={left.length}
            />
          </div>

          {/* Miniatures (cachées en mode focus) */}
          {focusedSide !== "left" && (
            <div className="flex flex-col gap-2 mt-2 opacity-60 hover:opacity-100 transition-opacity">
              {[...Array(Math.min(2, left.length - 1))].map((_, i) => {
                const idx = (leftIdx + 1 + i) % left.length;
                return (
                  <div 
                    key={left[idx].id}
                    className="w-[280px] rounded-xl px-3 py-2 cursor-pointer hover:scale-[1.02] transition-transform"
                    style={{
                      background: "rgba(255,255,255,0.45)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.4)",
                    }}
                    onClick={() => { setLeftIdx(idx); setLeftVis(true); }}
                  >
                    <p className="text-[#0D7377] text-[11px] font-bold truncate">
                      {CATEGORY_ICONS[left[idx].category]} {left[idx].label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Indicateurs */}
          <div className="flex gap-1.5 mt-3 pl-1">
            {left.map((_, i) => (
              <button 
                key={i}
                onClick={() => { 
                  setLeftIdx(i); 
                  setLeftVis(true); 
                  setNewLeft(true);
                  setFocusedSide(null);
                }}
                className="h-2 rounded-full transition-all duration-300 hover:scale-125"
                style={{ 
                  width: i === leftIdx ? 24 : 6,
                  background: i === leftIdx 
                    ? "linear-gradient(90deg, #0D7377, #14B8A6)" 
                    : "rgba(13,115,119,0.2)",
                  boxShadow: i === leftIdx ? "0 0 8px rgba(13,115,119,0.4)" : "none",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══ CÔTÉ DROIT ═══ */}
      {right.length > 0 && (
        <div 
          className="fixed z-30 hidden xl:flex flex-col items-end"
          style={{ 
            right: focusedSide === "right" ? "50%" : 10, 
            bottom: 140,
            transform: focusedSide === "right" ? "translateX(50%)" : "none",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div style={{ 
            opacity: rightVis ? 1 : 0, 
            transform: rightVis ? "translateY(0)" : "translateY(20px)", 
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            <InvocationCard 
              inv={right[rightIdx]} 
              visible={true} 
              isNew={newRight}
              isFocused={focusedSide === "right"}
              onFocus={() => setFocusedSide(focusedSide === "right" ? null : "right")}
              index={rightIdx}
              total={right.length}
            />
          </div>

          {focusedSide !== "right" && (
            <div className="flex flex-col gap-2 mt-2 opacity-60 hover:opacity-100 transition-opacity items-end">
              {[...Array(Math.min(2, right.length - 1))].map((_, i) => {
                const idx = (rightIdx + 1 + i) % right.length;
                return (
                  <div 
                    key={right[idx].id}
                    className="w-[280px] rounded-xl px-3 py-2 cursor-pointer hover:scale-[1.02] transition-transform text-right"
                    style={{
                      background: "rgba(255,255,255,0.45)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.4)",
                    }}
                    onClick={() => { setRightIdx(idx); setRightVis(true); }}
                  >
                    <p className="text-[#0D7377] text-[11px] font-bold truncate">
                      {right[idx].label} {CATEGORY_ICONS[right[idx].category]}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-1.5 mt-3 pr-1">
            {right.map((_, i) => (
              <button 
                key={i}
                onClick={() => { 
                  setRightIdx(i); 
                  setRightVis(true); 
                  setNewRight(true);
                  setFocusedSide(null);
                }}
                className="h-2 rounded-full transition-all duration-300 hover:scale-125"
                style={{ 
                  width: i === rightIdx ? 24 : 6,
                  background: i === rightIdx 
                    ? "linear-gradient(90deg, #0D7377, #14B8A6)" 
                    : "rgba(13,115,119,0.2)",
                  boxShadow: i === rightIdx ? "0 0 8px rgba(13,115,119,0.4)" : "none",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══ VERSION MOBILE ═══ */}
      {(left.length > 0 || right.length > 0) && (
        <div className="xl:hidden fixed z-40 inset-0 pointer-events-none">
          {/* Bouton flottant */}
          <button
            className="pointer-events-auto fixed bottom-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #0D7377, #14B8A6)",
              boxShadow: "0 4px 16px rgba(13,115,119,0.4)",
            }}
            onClick={() => setFocusedSide(focusedSide ? null : "left")}
          >
            {focusedSide ? "✕" : "🤲"}
          </button>

          {/* Overlay plein écran */}
          {focusedSide && (
            <div 
              className="pointer-events-auto fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setFocusedSide(null)}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <InvocationCard 
                  inv={focusedSide === "left" ? left[leftIdx] : right[rightIdx]} 
                  visible={true} 
                  isNew={false}
                  isFocused={true}
                  onFocus={() => {}}
                  index={focusedSide === "left" ? leftIdx : rightIdx}
                  total={focusedSide === "left" ? left.length : right.length}
                />
                
                {/* Navigation mobile */}
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    className="px-4 py-2 rounded-xl bg-white/80 text-[#0D7377] font-bold text-sm"
                    onClick={() => {
                      if (focusedSide === "left") {
                        setLeftIdx(p => (p - 1 + left.length) % left.length);
                      } else {
                        setRightIdx(p => (p - 1 + right.length) % right.length);
                      }
                    }}
                  >
                    ◀ Précédent
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl bg-white/80 text-[#0D7377] font-bold text-sm"
                    onClick={() => {
                      if (focusedSide === "left") {
                        setLeftIdx(p => (p + 1) % left.length);
                      } else {
                        setRightIdx(p => (p + 1) % right.length);
                      }
                    }}
                  >
                    Suivant ▶
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}