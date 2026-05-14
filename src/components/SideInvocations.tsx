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

const CATEGORY_CONFIG: Record<string, { icon: string; label: string; color: string; gradient: string; bgLight: string }> = {
  daily:    { icon: "☀️", label: "Invocation du jour", color: "#0D7377", gradient: "from-[#0D7377] to-[#14A0A5]", bgLight: "rgba(13,115,119,0.08)" },
  ramadan:  { icon: "🌙", label: "Ramadan",           color: "#7C3AED", gradient: "from-[#7C3AED] to-[#A78BFA]", bgLight: "rgba(124,58,237,0.08)" },
  eid_fitr: { icon: "🌟", label: "Aïd el-Fitr",       color: "#D97706", gradient: "from-[#D97706] to-[#FBBF24]", bgLight: "rgba(217,119,6,0.08)" },
  eid_adha: { icon: "🐑", label: "Aïd el-Adha",       color: "#059669", gradient: "from-[#059669] to-[#34D399]", bgLight: "rgba(5,150,105,0.08)" },
  ashoura:  { icon: "📿", label: "Achoura",           color: "#DC2626", gradient: "from-[#DC2626] to-[#F87171]", bgLight: "rgba(220,38,38,0.08)" },
};

function InvocationCard({ 
  inv, visible, isNew, isFocused, onFocus, index, total,
}: { 
  inv: Inv; visible: boolean; isNew: boolean; isFocused: boolean; onFocus: () => void; index: number; total: number;
}) {
  const [showNewBadge, setShowNewBadge] = useState(isNew);
  const config = CATEGORY_CONFIG[inv.category] || CATEGORY_CONFIG.daily;

  useEffect(() => { if (isNew) { const t = setTimeout(() => setShowNewBadge(false), 2500); return () => clearTimeout(t); } }, [isNew]);
  if (!visible) return null;

  return (
    <div 
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        width: isFocused ? "360px" : "260px",
        background: "linear-gradient(145deg, #ffffff1a 0%, #f8faf960 50%, #f0f4f3a6 100%)",
        border: `1px solid ${isFocused ? config.color + "40" : "rgba(255, 255, 255, 0.2)"}`,
        boxShadow: isFocused 
          ? `0 20px 60px ${config.color}25, 0 8px 24px rgba(0,0,0,0.1)` 
          : "0 4px 20px rgba(13,115,119,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        transform: isFocused ? "scale(1.03) translateY(-4px)" : "scale(1)",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={onFocus}
    >
      {/* Bandeau coloré en haut */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${config.gradient}`} />

      {/* Badge NEW */}
      {showNewBadge && (
        <span className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-[10px] font-black text-white animate-pulse shadow-lg"
          style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}88)` }}>
          NOUVEAU
        </span>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shadow-sm"
          style={{ background: config.bgLight, border: `1px solid ${config.color}20` }}>
          {config.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-gray-800 font-bold text-xs truncate" style={{ maxWidth: "160px" }}>{inv.label}</p>
          <p className="text-gray-400 text-[10px] font-medium">{config.label}</p>
        </div>
        <span className="text-[10px] font-mono text-gray-300 flex-shrink-0">{index + 1}/{total}</span>
      </div>

      {/* Arabe - Zone premium */}
      <div className="mx-3 my-2 rounded-xl p-3.5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f0f7f600 0%, #e8f4f2c0 100%)" }}>
        {/* Motif subtil */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0L20 10L10 20L0 10Z' fill='none' stroke='%230D7377' stroke-width='0.5'/%3E%3C/svg%3E")` }} />
        
        <p dir="rtl" className="text-right relative z-10"
          style={{
            fontSize: isFocused ? "1.3rem" : "1.15rem",
            fontFamily: "var(--font-arabic)",
            fontWeight: 700,
            lineHeight: "2.2",
            color: "#0a3d3d",
            wordSpacing: "0.08em",
            transition: "font-size 0.3s ease",
          }}>
          {inv.arabic}
        </p>
      </div>

      {/* Séparateur élégant */}
      <div className="mx-4 flex items-center gap-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <span className="text-[10px] text-gray-300">❖</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Français */}
      <div className="px-4 py-2.5">
        <p className="text-gray-600 leading-relaxed text-xs italic"
          style={{ fontFamily: "var(--font-sans)", fontSize: isFocused ? "12px" : "11px", transition: "font-size 0.3s ease" }}>
          {inv.french}
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: config.color }} />
          <span className="text-[8px] font-medium text-gray-400 uppercase tracking-wider">CCI Montmagny</span>
        </div>
        <span className="text-[8px] text-gray-300">🤲</span>
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
  const [newLeft, setNewLeft] = useState(false);
  const [newRight, setNewRight] = useState(false);
  const [focusedSide, setFocusedSide] = useState<"left" | "right" | null>(null);
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
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* ═══ CÔTÉ GAUCHE ═══ */}
      {left.length > 0 && (
        <div 
          className="fixed z-[5] hidden xl:flex flex-col"
          style={{ 
            left: focusedSide === "left" ? "50%" : 10, 
            bottom: 120,
            transform: focusedSide === "left" ? "translateX(-50%)" : "none",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: focusedSide === "left" ? "auto" : "none",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div style={{ 
            opacity: leftVis ? 1 : 0, 
            transform: leftVis ? "translateY(0)" : "translateY(20px)", 
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "auto",
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

          {/* Miniatures */}
          {focusedSide !== "left" && (
            <div className="flex flex-col gap-2 mt-2 opacity-40 hover:opacity-80 transition-opacity">
              {[...Array(Math.min(2, left.length - 1))].map((_, i) => {
                const idx = (leftIdx + 1 + i) % left.length;
                return (
                  <div 
                    key={left[idx].id}
                    className="w-[260px] rounded-xl px-3 py-2 cursor-pointer hover:scale-[1.02] transition-transform"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.77)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                    onClick={() => { setLeftIdx(idx); setLeftVis(true); }}
                  >
                    <p className="text-gray-700 text-[11px] font-bold truncate flex items-center gap-1.5">
                      <span>{CATEGORY_CONFIG[left[idx].category]?.icon || "🤲"}</span>
                      <span>{left[idx].label}</span>
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
          className="fixed z-[5] hidden xl:flex flex-col items-end"
          style={{ 
            right: focusedSide === "right" ? "50%" : 10, 
            bottom: 120,
            transform: focusedSide === "right" ? "translateX(50%)" : "none",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: focusedSide === "right" ? "auto" : "none",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div style={{ 
            opacity: rightVis ? 1 : 0, 
            transform: rightVis ? "translateY(0)" : "translateY(20px)", 
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "auto",
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
            <div className="flex flex-col gap-2 mt-2 opacity-40 hover:opacity-80 transition-opacity items-end">
              {[...Array(Math.min(2, right.length - 1))].map((_, i) => {
                const idx = (rightIdx + 1 + i) % right.length;
                return (
                  <div 
                    key={right[idx].id}
                    className="w-[260px] rounded-xl px-3 py-2 cursor-pointer hover:scale-[1.02] transition-transform text-right"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.6)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                    onClick={() => { setRightIdx(idx); setRightVis(true); }}
                  >
                    <p className="text-gray-700 text-[11px] font-bold truncate flex items-center justify-end gap-1.5">
                      <span>{right[idx].label}</span>
                      <span>{CATEGORY_CONFIG[right[idx].category]?.icon || "🤲"}</span>
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
        <div className="xl:hidden fixed z-[5] inset-0 pointer-events-none">
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