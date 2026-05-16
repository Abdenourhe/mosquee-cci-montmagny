"use client";
import { useEffect, useState, useCallback } from "react";
import { IconSun, IconMoon, IconStar, IconSheep, IconPrayer } from "./IconCMYK";

interface Inv { 
  id: string; 
  label: string; 
  arabic: string; 
  french: string; 
  side: string; 
  category: string;
}

const CATEGORY_CONFIG: Record<string, { 
  icon: React.ReactNode;
  label: string; 
  color: string; 
  gradient: string; 
  bgLight: string 
}> = {
  daily:    { 
    icon: <IconSun className="w-5 h-5" />,
    label: "Invocation du jour", 
    color: "#00A8A8", 
    gradient: "from-[#00A8A8] to-[#40C0C0]", 
    bgLight: "rgba(0,168,168,0.12)" 
  },
  ramadan:  { 
    icon: <IconMoon className="w-5 h-5" />,
    label: "Ramadan",           
    color: "#8B2E5A", 
    gradient: "from-[#8B2E5A] to-[#B85A8A]", 
    bgLight: "rgba(139,46,90,0.12)" 
  },
  eid_fitr: { 
    icon: <IconStar className="w-5 h-5" />,
    label: "Aïd el-Fitr",       
    color: "#D4A843", 
    gradient: "from-[#D4A843] to-[#F0D878]", 
    bgLight: "rgba(212,168,67,0.12)" 
  },
  eid_adha: { 
    icon: <IconSheep className="w-5 h-5" />,
    label: "Aïd el-Adha",       
    color: "#006666", 
    gradient: "from-[#006666] to-[#00A8A8]", 
    bgLight: "rgba(0,102,102,0.12)" 
  },
  ashoura:  { 
    icon: <IconPrayer className="w-5 h-5" />,
    label: "Achoura",           
    color: "#6B1E4A", 
    gradient: "from-[#6B1E4A] to-[#8B2E5A]", 
    bgLight: "rgba(107,30,74,0.12)" 
  },
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
        background: "linear-gradient(135deg, rgba(10, 46, 46, 0.85) 0%, rgba(26, 74, 74, 0.8) 100%)",
        backdropFilter: "blur(20px) saturate(150%)",
        WebkitBackdropFilter: "blur(20px) saturate(150%)",
        border: `1px solid ${isFocused ? config.color + "60" : "rgba(0, 168, 168, 0.3)"}`,
        boxShadow: isFocused 
          ? `0 20px 60px ${config.color}40, 0 8px 24px rgba(0,0,0,0.3)` 
          : "0 4px 20px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.1)",
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
        <div className="-9 h-9 rounded-lg flex items-center justify-center shadow-sm"
          style={{ 
            background: "linear-gradient(135deg, #D4E2DF 0%, #C8D8D5 100%)",
            border: `1px solid ${config.color}50`,
            boxShadow: `0 0 12px ${config.color}30`,
          }}>
          {config.icon}
        </div>
        <div className="min-w-0 flex-1">
          {/* Titre en BLANC */}
          <p className="text-white font-bold text-xs truncate" style={{ maxWidth: "160px" }}>
            {inv.label}
          </p>
          <p className="text-[#8AAAAA] text-[10px] font-medium">{config.label}</p>
        </div>
        <span className="text-[10px] font-mono text-[#8AAAAA] flex-shrink-0">{index + 1}/{total}</span>
      </div>

      {/* Arabe — fond plus foncé + texte OR */}
      <div className="mx-3 my-2 rounded-xl p-3.5 relative overflow-hidden"
        style={{ 
          background: "linear-gradient(135deg, rgba(5, 15, 15, 0.7) 0%, rgba(10, 30, 30, 0.6) 100%)",
          border: "1px solid rgba(0, 168, 168, 0.15)",
        }}>
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0L20 10L10 20L0 10Z' fill='none' stroke='%2300A8A8' stroke-width='0.5'/%3E%3C/svg%3E")` }} />
        
        <p dir="rtl" className="text-right relative z-10"
          style={{
            fontSize: isFocused ? "1.3rem" : "1.15rem",
            fontFamily: "var(--font-arabic)",
            fontWeight: 700,
            lineHeight: "2.2",
            color: "#E8C878",        /* ← OR CLAIR pour lisibilité */
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            wordSpacing: "0.08em",
            transition: "font-size 0.3s ease",
          }}>
          {inv.arabic}
        </p>
      </div>

      {/* Séparateur */}
      <div className="mx-4 flex items-center gap-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00A8A8]/30 to-transparent" />
        <span className="text-[10px] text-[#00A8A8]/50">❖</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00A8A8]/30 to-transparent" />
      </div>

      {/* Français — texte blanc cassé */}
      <div className="px-4 py-2.5">
        <p className="text-[#C8D8D5] leading-relaxed text-xs italic"
          style={{ fontFamily: "var(--font-sans)", fontSize: isFocused ? "12px" : "11px", transition: "font-size 0.3s ease" }}>
          {inv.french}
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-[#00A8A8]/20">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: config.color }} />
          <span className="text-[8px] font-medium text-[#8AAAAA] uppercase tracking-wider">CCI Montmagny</span>
        </div>
        <span className="text-[8px] text-[#8AAAAA]">🤲</span>
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

      {/* CÔTÉ GAUCHE */}
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

          {focusedSide !== "left" && (
            <div className="flex flex-col gap-2 mt-2">
              {[...Array(Math.min(2, left.length - 1))].map((_, i) => {
                const idx = (leftIdx + 1 + i) % left.length;
                const miniConfig = CATEGORY_CONFIG[left[idx].category] || CATEGORY_CONFIG.daily;
                return (
                  <div 
                    key={left[idx].id}
                    className="w-[260px] rounded-full px-4 py-2.5 cursor-pointer hover:scale-[1.02] transition-all duration-300 flex items-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)",
                      border: `2px solid ${miniConfig.color}50`,
                      boxShadow: `0 4px 12px ${miniConfig.color}30`,
                    }}
                    onClick={() => { setLeftIdx(idx); setLeftVis(true); }}
                  >
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: "linear-gradient(135deg, #D4E2DF 0%, #C8D8D5 100%)",
                        border: `1px solid ${miniConfig.color}60`,
                        boxShadow: `0 0 8px ${miniConfig.color}30`
                      }}
                    >
                      <span className="text-xs">{miniConfig.icon}</span>
                    </div>
                    <p className="text-white text-[11px] font-bold truncate flex-1">
                      {left[idx].label}
                    </p>
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: miniConfig.color }}
                    />
                  </div>
                );
              })}
            </div>
          )}

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
                    ? "linear-gradient(90deg, #00A8A8, #40C0C0)" 
                    : "rgba(0,168,168,0.2)",
                  boxShadow: i === leftIdx ? "0 0 8px rgba(0,168,168,0.5)" : "none",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* CÔTÉ DROIT */}
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
            <div className="flex flex-col gap-2 mt-2 items-end">
              {[...Array(Math.min(2, right.length - 1))].map((_, i) => {
                const idx = (rightIdx + 1 + i) % right.length;
                const miniConfig = CATEGORY_CONFIG[right[idx].category] || CATEGORY_CONFIG.daily;
                return (
                  <div 
                    key={right[idx].id}
                    className="w-[260px] rounded-full px-4 py-2.5 cursor-pointer hover:scale-[1.02] transition-all duration-300 flex items-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)",
                      border: `2px solid ${miniConfig.color}50`,
                      boxShadow: `0 4px 12px ${miniConfig.color}30`,
                    }}
                    onClick={() => { setRightIdx(idx); setRightVis(true); }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: miniConfig.color }}
                    />
                    <p className="text-white text-[11px] font-bold truncate flex-1 text-right">
                      {right[idx].label}
                    </p>
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: miniConfig.color + "30",
                        border: `1px solid ${miniConfig.color}60`
                      }}
                    >
                      <span className="text-xs">{miniConfig.icon}</span>
                    </div>
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
                    ? "linear-gradient(90deg, #00A8A8, #40C0C0)" 
                    : "rgba(0,168,168,0.2)",
                  boxShadow: i === rightIdx ? "0 0 8px rgba(0,168,168,0.5)" : "none",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* VERSION MOBILE */}
      {(left.length > 0 || right.length > 0) && (
        <div className="xl:hidden fixed z-[5] inset-0 pointer-events-none">
          <button
            className="pointer-events-auto fixed bottom-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #00A8A8, #40C0C0)",
              boxShadow: "0 4px 16px rgba(0,168,168,0.4)",
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
                    className="px-4 py-2 rounded-xl bg-[#D4E2DF] text-[#1A3A3A] font-bold text-sm"
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
                    className="px-4 py-2 rounded-xl bg-[#D4E2DF] text-[#1A3A3A] font-bold text-sm"
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