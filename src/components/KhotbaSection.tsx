"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContentRow { id: string; title: string | null; body: string; imageUrl: string | null; order: number; }
interface MediaItem  { url: string; type: "image" | "pdf"; }
interface KhotbaData { active: boolean; sujet: string; date: string; khatib: string; }

function parseMedia(raw: string | null): MediaItem[] {
  if (!raw) return [];
  try { const a = JSON.parse(raw); if (Array.isArray(a)) return a as MediaItem[]; } catch { /**/ }
  if (raw.startsWith("/") || raw.startsWith("http"))
    return [{ url: raw, type: raw.match(/\.pdf$/i) ? "pdf" : "image" }];
  return [];
}

export default function KhotbaSection() {
  const [data, setData]     = useState<KhotbaData | null>(null);
  const [archives, setArch] = useState<ContentRow[]>([]);
  const [open, setOpen]     = useState(false);
  const [lightbox, setLb]   = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [hoveredArchive, setHoveredArchive] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/content?section=khotba&t=${Date.now()}`).then(r => r.json()),
      fetch(`/api/content?section=khotba_archive&t=${Date.now()}`).then(r => r.json()),
    ]).then(([settings, arch]: [ContentRow[], ContentRow[]]) => {
      const g = (k: string) => settings.find(r => r.title === k)?.body;
      if (g("active") === "0") { setLoaded(true); return; }
      setData({ active: true, sujet: g("sujet") ?? "", date: g("date_prochaine") ?? "", khatib: g("khatib") ?? "" });
      setArch([...arch].sort((a, b) => a.order - b.order));
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  if (!loaded || !data?.active || !data.sujet) return null;

  const dateLabel = (() => {
    if (!data.date) return null;
    try {
      return new Intl.DateTimeFormat("fr-CA", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      }).format(new Date(data.date + "T12:00:00"));
    } catch { return data.date; }
  })();

  return (
    <div className="mt-8 px-2 sm:px-0">
      {/* ════════════════════════════════════════
           MAIN CARD — Glassmorphism Design
         ════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: "linear-gradient(145deg, rgba(7,30,32,0.95) 0%, rgba(12,40,42,0.9) 100%)",
          border: "1px solid rgba(197,160,89,0.15)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(197,160,89,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Decorative gradient orb */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(197,160,89,0.4) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(252,211,77,0.3) 0%, transparent 70%)" }}
        />

        {/* ── Header Bar ── */}
        <div
          className="relative flex items-center justify-between px-6 sm:px-8 py-4"
          style={{
            background: "linear-gradient(90deg, rgba(197,160,89,0.08) 0%, rgba(197,160,89,0.03) 50%, rgba(197,160,89,0.08) 100%)",
            borderBottom: "1px solid rgba(197,160,89,0.12)",
          }}
        >
          {/* Left: Label with icon */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{
                background: "linear-gradient(135deg, rgba(197,160,89,0.2) 0%, rgba(197,160,89,0.05) 100%)",
                border: "1px solid rgba(197,160,89,0.2)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(197,160,89,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span
              className="text-xs sm:text-sm font-black uppercase tracking-[0.2em]"
              style={{ color: "rgba(197,160,89,0.7)" }}
            >
              Khotba du Vendredi
            </span>
          </div>

          {/* Right: Arabic title */}
          <span
            dir="rtl"
            className="text-xl sm:text-2xl font-bold"
            style={{
              fontFamily: "'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', serif",
              color: "#FCD34D",
              textShadow: "0 0 20px rgba(252,211,77,0.15)",
            }}
          >
            خطبة الجمعة
          </span>
        </div>

        {/* ── Main Content ── */}
        <div className="relative px-6 sm:px-8 py-6 sm:py-8">

          {/* Subject */}
          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-white font-black leading-snug"
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            {data.sujet}
          </motion.h3>

          {/* Meta row: Khatib + Date */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4"
          >
            {data.khatib && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <span className="text-base font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {data.khatib}
                </span>
              </div>
            )}
            {dateLabel && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(252,211,77,0.1)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <span className="text-base font-bold" style={{ color: "#FCD34D" }}>
                  {dateLabel}
                </span>
              </div>
            )}
          </motion.div>

          {/* ── Divider ── */}
          {archives.length > 0 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 h-px origin-left"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(197,160,89,0.2) 20%, rgba(197,160,89,0.2) 80%, transparent 100%)" }}
            />
          )}

          {/* ── Archives Toggle ── */}
          {archives.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5"
            >
              <button
                onClick={() => setOpen(v => !v)}
                className="group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300"
                style={{
                  background: open ? "rgba(197,160,89,0.1)" : "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(197,160,89,0.15)",
                }}
              >
                <motion.span
                  animate={{ rotate: open ? 90 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-center w-6 h-6 rounded-md"
                  style={{ background: "rgba(197,160,89,0.15)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open ? "#FCD34D" : "rgba(197,160,89,0.6)"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </motion.span>
                <span
                  className="text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] transition-colors duration-300"
                  style={{ color: open ? "#FCD34D" : "rgba(197,160,89,0.6)" }}
                >
                  Archives ({archives.length})
                </span>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-bold"
                  style={{
                    background: "rgba(197,160,89,0.1)",
                    color: "rgba(197,160,89,0.6)",
                    border: "1px solid rgba(197,160,89,0.15)",
                  }}
                >
                  {archives.length}
                </span>
              </button>

              {/* ── Archives List ── */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {archives.map((item, index) => {
                        const media = parseMedia(item.imageUrl);
                        const isHovered = hoveredArchive === item.id;

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                            onMouseEnter={() => setHoveredArchive(item.id)}
                            onMouseLeave={() => setHoveredArchive(null)}
                            className="relative rounded-2xl p-4 sm:p-5 transition-all duration-300"
                            style={{
                              background: isHovered
                                ? "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(197,160,89,0.03) 100%)"
                                : "rgba(255,255,255,0.025)",
                              border: isHovered
                                ? "1px solid rgba(197,160,89,0.25)"
                                : "1px solid rgba(255,255,255,0.06)",
                              boxShadow: isHovered ? "0 4px 20px rgba(0,0,0,0.2)" : "none",
                            }}
                          >
                            {/* Timeline dot */}
                            <div
                              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-1.5 h-1.5 rounded-full transition-all duration-300"
                              style={{
                                background: isHovered ? "#FCD34D" : "rgba(197,160,89,0.3)",
                                boxShadow: isHovered ? "0 0 8px rgba(252,211,77,0.5)" : "none",
                              }}
                            />

                            <div className="flex items-start gap-3">
                              {/* Icon */}
                              <div
                                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mt-0.5"
                                style={{
                                  background: "linear-gradient(135deg, rgba(197,160,89,0.15) 0%, rgba(197,160,89,0.05) 100%)",
                                  border: "1px solid rgba(197,160,89,0.15)",
                                }}
                              >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(197,160,89,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                </svg>
                              </div>

                              <div className="flex-1 min-w-0">
                                {/* Title */}
                                <p className="text-white/90 font-bold text-base sm:text-lg leading-snug">
                                  {item.body}
                                </p>
                                {/* Subtitle / Date */}
                                {item.title && (
                                  <p className="text-white/35 text-sm sm:text-base mt-1 font-medium">
                                    {item.title}
                                  </p>
                                )}

                                {/* Media */}
                                {media.length > 0 && (
                                  <div className="flex flex-wrap gap-2.5 mt-3 pl-0">
                                    {media.map((m, mi) =>
                                      m.type === "image" ? (
                                        <motion.button
                                          key={mi}
                                          whileHover={{ scale: 1.08 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => setLb(m.url)}
                                          className="relative rounded-xl overflow-hidden cursor-zoom-in flex-shrink-0 group"
                                          style={{
                                            width: 96,
                                            height: 68,
                                            border: "1px solid rgba(197,160,89,0.2)",
                                          }}
                                        >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            src={m.url}
                                            alt=""
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                          />
                                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                            <svg
                                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                              width="24" height="24"
                                              viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"
                                            >
                                              <circle cx="11" cy="11" r="8"/>
                                              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                              <line x1="11" y1="8" x2="11" y2="14"/>
                                              <line x1="8" y1="11" x2="14" y2="11"/>
                                            </svg>
                                          </div>
                                        </motion.button>
                                      ) : (
                                        <motion.a
                                          key={mi}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          href={m.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300"
                                          style={{
                                            background: "linear-gradient(135deg, rgba(197,160,89,0.12) 0%, rgba(197,160,89,0.05) 100%)",
                                            color: "#FCD34D",
                                            border: "1px solid rgba(197,160,89,0.2)",
                                            textDecoration: "none",
                                          }}
                                        >
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                            <polyline points="14 2 14 8 20 8"/>
                                            <line x1="16" y1="13" x2="8" y2="13"/>
                                            <line x1="16" y1="17" x2="8" y2="17"/>
                                            <polyline points="10 9 9 9 8 9"/>
                                          </svg>
                                          PDF {mi + 1}
                                        </motion.a>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ════════════════════════════════════════
           LIGHTBOX — Enhanced Fullscreen
         ════════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.92)" }}
            onClick={() => setLb(null)}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              className="absolute top-5 right-5 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </motion.button>

            {/* Image */}
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              src={lightbox}
              alt=""
              className="max-w-[92vw] max-h-[85vh] rounded-2xl object-contain"
              style={{
                boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
              }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Subtle vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.3) 100%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}