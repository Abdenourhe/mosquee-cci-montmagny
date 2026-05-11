"use client";
import { useEffect, useState, useCallback } from "react";

interface Inv { id: string; label: string; arabic: string; french: string; side: string; }

function Card({ inv, visible, align }: { inv: Inv; visible: boolean; align: "left"|"right" }) {
  const slideOut = align === "left" ? "translateX(-14px)" : "translateX(14px)";
  return (
    <div style={{
      width: 260,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : `${slideOut} scale(0.95)`,
      transition: "opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)",
      pointerEvents: visible ? "auto" : "none",
      background: "linear-gradient(160deg,rgba(2,20,22,0.97),rgba(4,44,48,0.97))",
      border: "1px solid rgba(197,160,89,0.32)",
      borderRadius: 20,
      backdropFilter: "blur(18px)",
      boxShadow: "0 16px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
      overflow: "hidden",
    }}>
      {/* Gold top bar */}
      <div style={{ height: 3, background: "linear-gradient(90deg,transparent,#C5A059 40%,#FCD34D 60%,transparent)" }} />

      <div style={{ padding: "14px 16px 16px" }}>
        {/* ── Label ── */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          marginBottom: 12,
          justifyContent: align === "right" ? "flex-end" : "flex-start",
          flexDirection: align === "right" ? "row-reverse" : "row",
        }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>🤲</span>
          <p style={{
            color: "#FCD34D",
            fontSize: 20,
            fontWeight: 900,
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            textShadow: "0 0 16px rgba(252,211,77,0.35)",
            textAlign: align === "right" ? "right" : "left",
          }}>
            {inv.label}
          </p>
        </div>

        {/* ── Arabic ── */}
        <p dir="rtl" style={{
          color: "#FCD34D",
          fontFamily: "serif",
          fontSize: "1.1rem",
          lineHeight: 2,
          textAlign: "right",
          marginBottom: 10,
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {inv.arabic}
        </p>

        {/* Divider */}
        <div style={{ height: 1, marginBottom: 10,
          background: "linear-gradient(90deg,transparent,rgba(197,160,89,0.35),transparent)" }} />

        {/* ── French ── */}
        <p style={{
          color: "rgba(255,255,255,0.78)",
          fontSize: "0.8rem",
          lineHeight: 1.65,
          fontStyle: "italic",
          textAlign: align === "right" ? "right" : "left",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {inv.french}
        </p>
      </div>

      {/* Gold bottom bar */}
      <div style={{ height: 2, background: "linear-gradient(90deg,transparent,rgba(197,160,89,0.22),transparent)" }} />
    </div>
  );
}

function Dots({ total, current, align }: { total: number; current: number; align: "left"|"right" }) {
  const max = Math.min(total, 12);
  if (max <= 1) return null;
  return (
    <div style={{ display: "flex", gap: 4, marginTop: 8,
      justifyContent: align === "right" ? "flex-end" : "flex-start" }}>
      {Array.from({ length: max }).map((_,i) => (
        <div key={i} style={{ borderRadius: 9999, transition: "all 0.4s ease",
          width: i === current % max ? 16 : 5, height: 5,
          backgroundColor: i === current % max ? "rgba(197,160,89,0.9)" : "rgba(197,160,89,0.2)" }} />
      ))}
    </div>
  );
}

export default function SideInvocations() {
  const [left,  setLeft]  = useState<Inv[]>([]);
  const [right, setRight] = useState<Inv[]>([]);
  const [enabled, setEnabled]         = useState(true);
  const [leftIdx,  setLeftIdx]        = useState(0);
  const [rightIdx, setRightIdx]       = useState(0);
  const [leftVis,  setLeftVis]        = useState(true);
  const [rightVis, setRightVis]       = useState(true);

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
    setTimeout(() => { setLeftIdx(p => (p+1) % Math.max(1,left.length)); setLeftVis(true); }, 580);
  }, [left.length]);

  const rotateRight = useCallback(() => {
    setRightVis(false);
    setTimeout(() => { setRightIdx(p => (p+1) % Math.max(1,right.length)); setRightVis(true); }, 580);
  }, [right.length]);

  useEffect(() => {
    if (!enabled || left.length <= 1) return;
    const id = setInterval(rotateLeft, 6000); return () => clearInterval(id);
  }, [enabled, left.length, rotateLeft]);

  useEffect(() => {
    if (!enabled || right.length <= 1) return;
    const t = setTimeout(() => {
      const id = setInterval(rotateRight, 6000); return () => clearInterval(id);
    }, 3000); return () => clearTimeout(t);
  }, [enabled, right.length, rotateRight]);

  if (!enabled || (left.length === 0 && right.length === 0)) return null;

  return (
    <>
      {left.length > 0 && (
        <div className="fixed z-30 hidden xl:flex flex-col"
          style={{ left: 10, top: "50%", transform: "translateY(-50%)" }}>
          <Card inv={left[leftIdx]} visible={leftVis} align="left" />
          <Dots total={left.length} current={leftIdx} align="left" />
        </div>
      )}
      {right.length > 0 && (
        <div className="fixed z-30 hidden xl:flex flex-col items-end"
          style={{ right: 10, top: "50%", transform: "translateY(-50%)" }}>
          <Card inv={right[rightIdx]} visible={rightVis} align="right" />
          <Dots total={right.length} current={rightIdx} align="right" />
        </div>
      )}
    </>
  );
}
