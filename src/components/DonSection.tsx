"use client";

import { useState, useEffect } from "react";

interface Year { label: string; goal: number; collected: number; }
interface DonData {
  nomMosquee:   string;
  projetTitre:  string;
  projetResume: string;
  objectif:     number;
  collecte:     number;
  interac:      string;
  qrUrl:        string;
  years:        Year[];
  photos:       string[];
}

const DEFAULT: DonData = {
  nomMosquee:   "CCI de Montmagny",
  projetTitre:  "",
  projetResume: "",
  objectif:     50000,
  collecte:     0,
  interac:      "Montmagny.ccim@gmail.com",
  qrUrl:        "",
  years:        [],
  photos:       [],
};

const STEP_COLORS = ["#C5A059", "#0D9488", "#7C3AED", "#E07B39", "#BE185D"];

function num(v: string | undefined, fb: number) {
  const n = parseFloat(v ?? "");
  return isNaN(n) ? fb : n;
}

export default function DonSection() {
  const [data, setData]       = useState<DonData>(DEFAULT);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const load = () => {
    Promise.all([
      fetch(`/api/content?section=don&t=${Date.now()}`).then(r => r.json()),
      fetch(`/api/content?section=don_photos&t=${Date.now()}`).then(r => r.json()),
    ]).then(([rows, photoRows]: [{ title: string | null; body: string }[], { imageUrl?: string }[]]) => {
      const g = (k: string) => rows.find(r => r.title === k)?.body;

      let years: Year[] = [];
      try {
        const y = JSON.parse(g("years_plan") ?? "[]");
        if (Array.isArray(y) && y.length) years = y;
      } catch { /* ignore */ }

      const totalG = years.length > 0 ? years.reduce((s, y) => s + (y.goal || 0), 0) : num(g("objectif"), 50000);
      const totalC = years.length > 0 ? years.reduce((s, y) => s + (y.collected || 0), 0) : num(g("collecte"), 0);
      const photos = photoRows.filter(r => r.imageUrl).map(r => r.imageUrl as string);

      setData({
        nomMosquee:   g("nom_mosquee")   ?? DEFAULT.nomMosquee,
        projetTitre:  g("projet_titre")  ?? "",
        projetResume: g("projet_resume") ?? "",
        objectif: totalG,
        collecte: totalC,
        interac:  g("interac_email") ?? DEFAULT.interac,
        qrUrl:    g("qr_code_url")   ?? "",
        years, photos,
      });
    }).catch(() => {});
  };

  useEffect(() => {
    load();
    const onVis = () => { if (document.visibilityState === "visible") load(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct   = data.objectif > 0 ? Math.min(100, Math.round((data.collecte / data.objectif) * 100)) : 0;
  const reste = Math.max(0, data.objectif - data.collecte);
  const title = data.projetTitre || `Soutenir ${data.nomMosquee}`;

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(160deg,#031F20 0%,#083032 55%,#0D3C3E 100%)", border: "1px solid rgba(197,160,89,0.2)" }}>

          {/* ── Gold top bar ── */}
          <div style={{ height: 3, background: "linear-gradient(90deg,transparent,#C5A059 30%,#FCD34D 60%,transparent)" }} />

          <div className="p-6 sm:p-8 lg:p-10">

            {/* ── Titre du projet ── */}
            <div className="mb-7 text-center sm:text-left">
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "rgba(197,160,89,0.6)" }}>
                Campagne de dons — {data.nomMosquee}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug mb-2">{title}</h2>
              {data.projetResume && (
                <p className="text-white/55 text-sm leading-relaxed max-w-2xl">{data.projetResume}</p>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">

              {/* ── Colonne gauche : Progress + Interac ── */}
              <div className="space-y-5">

                {/* Chiffres + barre */}
                <div className="rounded-2xl p-5"
                  style={{ background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.05)" }}>

                  <div className="flex items-end justify-between mb-1 gap-2">
                    <div>
                      <div className="text-4xl sm:text-5xl font-black leading-none tabular-nums"
                        style={{ color: "#4ADE80" }}>
                        {data.collecte.toLocaleString("fr-CA")} $
                      </div>
                      <div className="text-white/38 text-xs mt-1">montant collecté</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-4xl font-black tabular-nums" style={{ color: "#FCD34D" }}>{pct}<span className="text-2xl">%</span></div>
                      <div className="text-white/38 text-xs">{reste.toLocaleString("fr-CA")} $ restant</div>
                    </div>
                  </div>

                  <div className="text-white/30 text-xs mb-4">
                    Objectif : <span className="text-white/55 font-black">{data.objectif.toLocaleString("fr-CA")} $</span>
                  </div>

                  {/* Barre */}
                  <div className="rounded-full overflow-hidden" style={{ height: 16, background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full transition-all duration-700 relative"
                      style={{ width: `${pct}%`, background: "linear-gradient(90deg,#C5A059,#4ADE80)", boxShadow: "0 0 16px rgba(74,222,128,0.3)" }}>
                      {pct > 14 && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black" style={{ color: "rgba(0,0,0,0.45)" }}>
                          {pct}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interac */}
                <div className="rounded-2xl p-5"
                  style={{ background: "rgba(197,160,89,0.08)", border: "1px solid rgba(197,160,89,0.22)" }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "rgba(197,160,89,0.6)" }}>
                        Don par Interac e-Transfer
                      </div>
                      <div className="font-black text-xl" style={{ color: "#FCD34D" }}>{data.interac}</div>
                      <div className="text-white/30 text-xs mt-1">Dépôt automatique · sans mot de passe</div>
                    </div>
                    {data.qrUrl && (
                      <div className="flex-shrink-0 bg-white rounded-xl p-1.5 w-14 h-14">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={data.qrUrl} alt="QR" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Ayah */}
                <div className="text-center pt-1">
                  <p className="text-sm leading-loose" dir="rtl"
                    style={{ color: "rgba(197,160,89,0.45)", fontFamily: "serif" }}>
                    مَن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ أَضْعَافًا كَثِيرَةً
                  </p>
                  <p className="text-white/20 text-xs italic mt-1">
                    « Qui est-ce qui prêtera à Allah un beau prêt ? » — Al-Baqarah 2:245
                  </p>
                </div>
              </div>

              {/* ── Colonne droite : Étapes + Photos ── */}
              <div className="space-y-5">

                {/* Plan par étape */}
                {data.years.length > 0 && (
                  <div className="rounded-2xl overflow-hidden"
                    style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="px-4 py-3"
                      style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(197,160,89,0.55)" }}>
                        Plan de financement par étape
                      </span>
                    </div>
                    <div className="divide-y" style={{ divideColor: "rgba(255,255,255,0.04)" }}>
                      {data.years.map((yr, i) => {
                        const p = yr.goal > 0 ? Math.min(100, Math.round((yr.collected / yr.goal) * 100)) : 0;
                        const col = STEP_COLORS[i % STEP_COLORS.length];
                        const done = p >= 100;
                        return (
                          <div key={i} className="px-4 py-3.5">
                            <div className="flex items-center justify-between mb-2 gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: col, boxShadow: `0 0 6px ${col}80` }} />
                                <span className="text-white font-bold text-sm truncate">{yr.label}{done ? " ✅" : ""}</span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 text-right">
                                <span className="text-white/35 text-xs">{yr.collected.toLocaleString("fr-CA")} / {yr.goal.toLocaleString("fr-CA")} $</span>
                                <span className="font-black text-sm w-10 text-right" style={{ color: col }}>{p}%</span>
                              </div>
                            </div>
                            <div className="rounded-full overflow-hidden" style={{ height: 5, background: "rgba(255,255,255,0.07)" }}>
                              <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${p}%`, background: col }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Photos */}
                {data.photos.length > 0 && (
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest mb-2.5" style={{ color: "rgba(197,160,89,0.55)" }}>
                      Photos du projet
                    </div>
                    <div className={`grid gap-2 ${data.photos.length === 1 ? "grid-cols-1" : data.photos.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                      {data.photos.slice(0, 6).map((url, i) => (
                        <button key={i} onClick={() => setLightbox(url)}
                          className="rounded-xl overflow-hidden hover:scale-[1.03] transition-transform cursor-zoom-in relative"
                          style={{ aspectRatio: "4/3", border: "1px solid rgba(197,160,89,0.18)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          {i === 5 && data.photos.length > 6 && (
                            <div className="absolute inset-0 flex items-center justify-center text-white font-black text-xl"
                              style={{ background: "rgba(0,0,0,0.55)" }}>
                              +{data.photos.length - 6}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 p-4"
          onClick={() => setLightbox(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain" />
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center text-xl">✕</button>
        </div>
      )}
    </section>
  );
}
