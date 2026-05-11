"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Session } from "next-auth";
import AdminShell from "@/components/admin/AdminShell";

interface Props { session: Session; }
type FieldType = "number" | "text" | "email" | "url" | "textarea" | "direction";
interface DonField { key: string; label: string; icon: string; type: FieldType; hint?: string; placeholder?: string; }
interface YearRow  { label: string; goal: number; collected: number; }
interface ContentRow { id: string; section: string; title: string | null; body: string; imageUrl?: string | null; order: number; }

const FIELDS: DonField[] = [
  { key: "nom_mosquee",    label: "Nom de la mosquée",          icon: "🕌", type: "text",     placeholder: "CCI de Montmagny" },
  { key: "ville",          label: "Ville",                      icon: "📍", type: "text",     placeholder: "Montmagny, Qc" },
  { key: "projet_titre",   label: "Titre du projet",            icon: "🏗", type: "text",     hint: "Titre affiché en en-tête de la section dons", placeholder: "Construction / Rénovation de la mosquée" },
  { key: "projet_resume",  label: "Résumé du projet (site public)", icon: "📄", type: "textarea", hint: "Description détaillée visible sur le site", placeholder: "Notre communauté travaille à..." },
  { key: "objectif",       label: "Objectif total ($)",         icon: "🎯", type: "number",   hint: "Utilisé si le plan pluriannuel n'est pas défini", placeholder: "50000" },
  { key: "collecte",       label: "Montant collecté ($)",       icon: "💰", type: "number",   hint: "Utilisé si le plan pluriannuel n'est pas défini", placeholder: "0" },
  { key: "depenses_fixes", label: "Dépenses fixes / mois ($)",  icon: "📊", type: "number",   hint: "Loyer, électricité, etc.", placeholder: "1000" },
  { key: "interac_email",  label: "Courriel Interac",           icon: "💳", type: "email",    placeholder: "Montmagny.ccim@gmail.com" },
  { key: "description",    label: "Message de motivation (TV)", icon: "✍️", type: "textarea", hint: "Affiché sur l'écran TV", placeholder: "Votre générosité est la clé de notre succès." },
  { key: "ticker_text",    label: "Texte du bandeau TV",        icon: "📢", type: "textarea", hint: "Texte défilant en bas de l'écran TV", placeholder: "جزاك الله خيراً على صدقتك..." },
  { key: "ticker_direction", label: "Direction du bandeau",     icon: "↔️", type: "direction", hint: "RTL = droite→gauche (arabe) · LTR = gauche→droite (français)" },
  { key: "qr_code_url",    label: "URL du QR Code",             icon: "📱", type: "url",      hint: "Image QR Code pour les dons", placeholder: "https://..." },
  { key: "share_facebook",  label: "Page Facebook",             icon: "📘", type: "url",      hint: "URL de la page Facebook", placeholder: "https://facebook.com/..." },
  { key: "share_whatsapp",  label: "Numéro / lien WhatsApp",   icon: "💬", type: "text",     hint: "Numéro avec indicatif ou lien wa.me", placeholder: "+1 418 XXX-XXXX" },
  { key: "social_instagram", label: "Page Instagram",           icon: "📸", type: "url",      hint: "URL du compte Instagram", placeholder: "https://instagram.com/..." },
  { key: "google_sheet_url", label: "Google Sheet URL",         icon: "📋", type: "url",      hint: "URL publique pour synchronisation automatique", placeholder: "https://docs.google.com/spreadsheets/..." },
];

const BAR_COLORS = ["#C5A059","#0D9488","#7C3AED","#B45309","#BE185D"];

export default function DonManager({ session }: Props) {
  const [rows, setRows]       = useState<ContentRow[]>([]);
  const [values, setValues]   = useState<Record<string, string>>({});
  const [years, setYears]     = useState<YearRow[]>([{ label: "Année 1", goal: 10000, collected: 0 }]);
  const [photos, setPhotos]   = useState<ContentRow[]>([]);
  const [saving, setSaving]   = useState<Record<string, boolean>>({});
  const [saved, setSaved]     = useState<Record<string, boolean>>({});
  const [yearSaved, setYearSaved]   = useState(false);
  const [yearSaving, setYearSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [donRes, photoRes] = await Promise.all([
        fetch(`/api/content?section=don&t=${Date.now()}`),
        fetch(`/api/content?section=don_photos&t=${Date.now()}`),
      ]);
      const donData: ContentRow[]   = await donRes.json();
      const photoData: ContentRow[] = await photoRes.json();
      setRows(donData);
      setPhotos(photoData.filter((r) => r.imageUrl));
      const map: Record<string, string> = {};
      donData.forEach((r) => { if (r.title) map[r.title] = r.body; });
      setValues(map);
      try {
        const y: YearRow[] = JSON.parse(map["years_plan"] ?? "[]");
        if (Array.isArray(y) && y.length > 0) setYears(y);
      } catch { /* ignore */ }
    } catch { setError("Impossible de charger les données."); }
    finally   { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── save single field ── */
  const save = async (key: string) => {
    setSaving((p) => ({ ...p, [key]: true }));
    setSaved((p) => ({ ...p, [key]: false }));
    try {
      const existing = rows.find((r) => r.title === key);
      if (existing) {
        await fetch(`/api/content/${existing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...existing, body: values[key] ?? "" }),
        });
      } else {
        const res = await fetch("/api/content", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section: "don", title: key, body: values[key] ?? "", order: FIELDS.findIndex((f) => f.key === key) }),
        });
        const created: ContentRow = await res.json();
        setRows((p) => [...p, created]);
      }
      setSaved((p) => ({ ...p, [key]: true }));
      setTimeout(() => setSaved((p) => ({ ...p, [key]: false })), 2500);
    } catch { setError("Erreur lors de la sauvegarde."); }
    finally   { setSaving((p) => ({ ...p, [key]: false })); }
  };

  /* ── save years_plan ── */
  const saveYears = async () => {
    setYearSaving(true); setYearSaved(false);
    const body = JSON.stringify(years);
    try {
      const existing = rows.find((r) => r.title === "years_plan");
      if (existing) {
        await fetch(`/api/content/${existing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...existing, body }),
        });
      } else {
        const res = await fetch("/api/content", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section: "don", title: "years_plan", body, order: 99 }),
        });
        const created: ContentRow = await res.json();
        setRows((p) => [...p, created]);
      }
      setYearSaved(true);
      setTimeout(() => setYearSaved(false), 2500);
    } catch { setError("Erreur lors de la sauvegarde des années."); }
    finally   { setYearSaving(false); }
  };

  const addYear = () => setYears((p) => [...p, { label: `Année ${p.length + 1}`, goal: 10000, collected: 0 }]);
  const removeYear = (i: number) => setYears((p) => p.filter((_, j) => j !== i));
  const updateYear = (i: number, field: keyof YearRow, val: string) =>
    setYears((p) => p.map((y, j) => j !== i ? y : { ...y, [field]: field === "label" ? val : parseFloat(val) || 0 }));

  /* ── upload photos ── */
  const uploadPhotos = async (files: FileList) => {
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      const urls: string[] = data.urls ?? [];
      for (const [idx, url] of urls.entries()) {
        const r = await fetch("/api/content", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section: "don_photos", title: null, body: "", imageUrl: url, order: photos.length + idx }),
        });
        const created: ContentRow = await r.json();
        setPhotos((p) => [...p, created]);
      }
    } catch { setError("Erreur lors de l'upload."); }
    finally   { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  /* ── delete photo ── */
  const deletePhoto = async (id: string) => {
    try {
      await fetch(`/api/content/${id}`, { method: "DELETE" });
      setPhotos((p) => p.filter((r) => r.id !== id));
    } catch { setError("Erreur lors de la suppression."); }
  };

  /* ── computed values ── */
  const totalGoal = years.reduce((s, y) => s + (y.goal || 0), 0);
  const totalColl = years.reduce((s, y) => s + (y.collected || 0), 0);

  /* Use years totals if plan is defined, otherwise fall back to global fields */
  const displayG = totalGoal > 0 ? totalGoal : (parseFloat(values["objectif"] ?? "0") || 50000);
  const displayC = totalGoal > 0 ? totalColl : (parseFloat(values["collecte"] ?? "0") || 0);
  const pct      = displayG > 0 ? Math.min(100, Math.round((displayC / displayG) * 100)) : 0;
  const reste    = Math.max(0, displayG - displayC);
  const dir      = values["ticker_direction"] ?? "rtl";
  const yearsPct = totalGoal > 0 ? Math.min(100, Math.round((totalColl / totalGoal) * 100)) : 0;

  return (
    <AdminShell session={session}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">💰</span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">Gestion des Dons</h1>
          </div>
          <p className="text-sm text-gray-500 ml-10">Projet, objectif, collecte, photos, plan pluriannuel, affichage TV</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

        {/* ── APERÇU PROGRESSION ── */}
        <div className="mb-5 p-4 sm:p-5 rounded-2xl border bg-white shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Aperçu progression — {totalGoal > 0 ? "depuis le plan pluriannuel" : "champs globaux"}
          </div>
          <div className="flex items-end gap-4 mb-3 flex-wrap">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">{displayC.toLocaleString("fr-CA")} $</div>
              <div className="text-xs text-gray-400">collecté</div>
            </div>
            <div className="text-gray-300 text-2xl mb-1">/</div>
            <div>
              <div className="text-lg font-bold text-gray-700">{displayG.toLocaleString("fr-CA")} $</div>
              <div className="text-xs text-gray-400">objectif global</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-2xl font-black text-amber-500">{pct}%</div>
              <div className="text-xs text-gray-400">{reste.toLocaleString("fr-CA")} $ restant</div>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg,#0D7377,#C5A059)" }} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ── PLAN PLURIANNUEL ── */}
            <div className="mb-5 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <span className="font-black text-gray-800">Plan pluriannuel</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 ml-7">
                    Les totaux de ce plan remplacent les champs Objectif / Collecté globaux
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={addYear}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-all">
                    + Ajouter
                  </button>
                  <button onClick={saveYears} disabled={yearSaving}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{ background: yearSaved ? "#10b981" : yearSaving ? "#9ca3af" : "linear-gradient(135deg,#0D7377,#14b8a6)", color: "white" }}>
                    {yearSaved ? "✓ Sauvegardé" : yearSaving ? "..." : "Sauvegarder"}
                  </button>
                </div>
              </div>

              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-6 text-sm flex-wrap">
                <div><span className="text-gray-400 text-xs">Total objectif : </span><span className="font-black text-gray-800">{totalGoal.toLocaleString("fr-CA")} $</span></div>
                <div><span className="text-gray-400 text-xs">Total collecté : </span><span className="font-black text-emerald-600">{totalColl.toLocaleString("fr-CA")} $</span></div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${yearsPct}%`, background: "linear-gradient(90deg,#0D7377,#C5A059)" }} />
                  </div>
                  <span className="font-black text-amber-600 text-sm">{yearsPct}%</span>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {years.map((yr, i) => {
                  const yPct = yr.goal > 0 ? Math.min(100, Math.round((yr.collected / yr.goal) * 100)) : 0;
                  const col  = BAR_COLORS[i % BAR_COLORS.length];
                  return (
                    <div key={i} className="px-5 py-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs text-gray-400 font-bold block mb-1">Étiquette</label>
                            <input value={yr.label} onChange={(e) => updateYear(i, "label", e.target.value)}
                              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 font-bold block mb-1">Objectif ($)</label>
                            <input type="number" value={yr.goal} onChange={(e) => updateYear(i, "goal", e.target.value)}
                              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 font-bold block mb-1">Collecté ($)</label>
                            <input type="number" value={yr.collected} onChange={(e) => updateYear(i, "collected", e.target.value)}
                              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                          </div>
                        </div>
                        <button onClick={() => removeYear(i)} className="mt-5 text-red-400 hover:text-red-600 text-lg transition-colors flex-shrink-0">✕</button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${yPct}%`, background: col }} />
                        </div>
                        <span className="text-xs font-black text-gray-500 w-8 text-right">{yPct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── PHOTOS DU PROJET ── */}
            <div className="mb-5 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🖼</span>
                    <span className="font-black text-gray-800">Photos du projet</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 ml-7">
                    Affichées sur le site public et l&apos;écran TV
                  </p>
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
                  style={{ background: uploading ? "#9ca3af" : "linear-gradient(135deg,#0D7377,#14b8a6)" }}>
                  {uploading ? "Envoi..." : "+ Ajouter photos"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.length) uploadPhotos(e.target.files); }}
                />
              </div>

              {photos.length === 0 ? (
                <div
                  className="px-5 py-10 text-center text-gray-400 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fileRef.current?.click()}>
                  <div className="text-3xl mb-2">📷</div>
                  Cliquez pour ajouter des photos du projet
                </div>
              ) : (
                <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {photos.map((p) => (
                    <div key={p.id} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.imageUrl!} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => deletePhoto(p.id)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-teal-200 flex flex-col items-center justify-center text-teal-500 hover:bg-teal-50 transition-colors text-xs font-bold gap-1">
                    <span className="text-2xl">+</span>
                    <span>Ajouter</span>
                  </button>
                </div>
              )}
            </div>

            {/* ── CHAMPS GÉNÉRAUX ── */}
            <div className="space-y-3">
              {FIELDS.map((field) => (
                <div key={field.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{field.icon}</span>
                        <span className="font-bold text-gray-800 text-sm">{field.label}</span>
                      </div>
                      {field.hint && <p className="text-xs text-gray-400 mt-0.5 ml-7">{field.hint}</p>}
                    </div>
                    <button onClick={() => save(field.key)} disabled={saving[field.key]}
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{ background: saved[field.key] ? "#10b981" : saving[field.key] ? "#9ca3af" : "linear-gradient(135deg,#0D7377,#14b8a6)", color: "white" }}>
                      {saved[field.key] ? "✓ Sauvegardé" : saving[field.key] ? "..." : "Sauvegarder"}
                    </button>
                  </div>

                  {field.type === "direction" ? (
                    <div className="flex gap-3">
                      {(["rtl", "ltr"] as const).map((v) => (
                        <button key={v} type="button" onClick={() => setValues((p) => ({ ...p, ticker_direction: v }))}
                          className="flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all"
                          style={{ borderColor: dir === v ? "#0D7377" : "#e5e7eb", background: dir === v ? "rgba(13,115,119,0.08)" : "white", color: dir === v ? "#0D7377" : "#6b7280" }}>
                          {v === "rtl" ? "→ ← عربي (RTL)" : "← → Français (LTR)"}
                        </button>
                      ))}
                    </div>
                  ) : field.type === "textarea" ? (
                    <textarea rows={field.key === "projet_resume" ? 4 : 3} value={values[field.key] ?? ""}
                      onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
                  ) : (
                    <input type={field.type} value={values[field.key] ?? ""}
                      onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                  )}
                </div>
              ))}
            </div>

            {/* Ticker preview */}
            {values["ticker_text"] && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-amber-200">
                <div className="bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-widest">Aperçu bandeau TV</div>
                <div className="bg-gray-900 px-4 py-3 overflow-hidden">
                  <p className="text-amber-300 text-sm font-bold" dir={dir as "ltr" | "rtl"}
                    style={{ fontFamily: dir === "rtl" ? "serif" : "system-ui", textAlign: dir === "rtl" ? "right" : "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {values["ticker_text"]}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick links */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <a href="/affichage" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-teal-300 text-teal-700 font-bold text-sm hover:bg-teal-50 transition-all">
            📺 Ouvrir l&apos;affichage TV
          </a>
          <a href="/#don" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-amber-300 text-amber-700 font-bold text-sm hover:bg-amber-50 transition-all">
            🌐 Voir sur le site
          </a>
        </div>
      </div>
    </AdminShell>
  );
}
