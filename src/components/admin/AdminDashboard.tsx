"use client";

import { Session } from "next-auth";
import { useEffect, useState, useRef } from "react";
import AdminShell from "./AdminShell";
import Link from "next/link";

interface Props {
  session: Session;
  stats: { contentCount: number; messageCount: number; unreadCount: number };
  initialAddress?: string;
  initialEmail?: string;
}

type SiteMode = "normal" | "ramadan" | "eid_fitr" | "eid_adha";

const MODES = [
  { id: "normal"   as SiteMode, label: "Normal",      emoji: "🕌", desc: "Mode standard",    color: "#0D7377", bg: "#EBF9FA" },
  { id: "ramadan"  as SiteMode, label: "Ramadan",     emoji: "🌙", desc: "Thème Ramadan",     color: "#0F6B47", bg: "#E8F5EE" },
  { id: "eid_fitr" as SiteMode, label: "Aid el-Fitr", emoji: "🌟", desc: "Fin du Ramadan",    color: "#B45309", bg: "#FFF8EC" },
  { id: "eid_adha" as SiteMode, label: "Aid el-Adha", emoji: "🐑", desc: "Fête du sacrifice", color: "#7C5A14", bg: "#FDF5E8" },
];

export default function AdminDashboard({ session, stats, initialAddress, initialEmail }: Props) {
  const [mode, setMode]     = useState<SiteMode>("normal");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState<string | null>(null);

  const [address, setAddress]       = useState(initialAddress ?? "Montmagny, Québec\nG5V 1J9, Canada");
  const [email, setEmail]           = useState(initialEmail   ?? "info@ccimontmagny.ca");
  const [coordOpen, setCoordOpen]   = useState(false);
  const [coordSaving, setCoordSaving] = useState(false);
  const [coordMsg, setCoordMsg]     = useState<{ type: "success" | "error"; text: string } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/site-mode").then((r) => r.json())
      .then((d) => { if (d.mode) setMode(d.mode); }).catch(() => {});
  }, []);

  // Close modal on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (coordOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setCoordOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [coordOpen]);

  const handleMode = async (m: SiteMode) => {
    setSaving(true);
    const res = await fetch("/api/site-mode", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: m }),
    });
    setSaving(false);
    if (res.ok) { setMode(m); setMsg("Mode mis à jour !"); setTimeout(() => setMsg(null), 3000); }
  };

  const upsertSetting = async (title: string, body: string) => {
    const res  = await fetch("/api/content?section=site_settings");
    const rows: { id: string; title: string; body: string; section: string; order: number }[] = await res.json();
    const existing = rows.find((r) => r.title === title);
    if (existing) {
      await fetch(`/api/content/${existing.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...existing, body }),
      });
    } else {
      await fetch("/api/content", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "site_settings", title, body, order: 0 }),
      });
    }
  };

  const handleSaveCoord = async () => {
    setCoordSaving(true);
    try {
      await Promise.all([upsertSetting("address", address), upsertSetting("email", email)]);
      setCoordMsg({ type: "success", text: "Coordonnées mises à jour !" });
      setTimeout(() => { setCoordMsg(null); setCoordOpen(false); }, 1600);
    } catch {
      setCoordMsg({ type: "error", text: "Erreur lors de la sauvegarde" });
      setTimeout(() => setCoordMsg(null), 4000);
    }
    setCoordSaving(false);
  };

  const activeMode = MODES.find((m) => m.id === mode) ?? MODES[0];

  return (
    <AdminShell session={session} unreadCount={stats.unreadCount}>
      <div className="max-w-5xl mx-auto">

        {/* Header row */}
        <div className="flex items-start justify-between mb-6 sm:mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Tableau de bord</h1>
            <p className="text-gray-500 mt-1 text-sm">Bienvenue, {session.user?.name} · CCI Montmagny</p>
          </div>

          {/* 📍 Coordonnées — icône compacte */}
          <div className="relative" ref={modalRef}>
            <button
              onClick={() => { setCoordOpen(!coordOpen); setCoordMsg(null); }}
              title="Coordonnées du site"
              className="flex items-center gap-2 px-3 py-2.5 rounded-2xl border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md text-sm font-bold"
              style={{
                backgroundColor: coordOpen ? "#EBF9FA" : "white",
                borderColor: coordOpen ? "#0D7377" : "#e5e7eb",
                color: "#0D7377",
              }}
            >
              <span className="text-base">📍</span>
              <span className="hidden sm:inline">Coordonnées</span>
            </button>

            {/* Dropdown panel */}
            {coordOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <span className="font-black text-gray-900 text-sm">Coordonnées du site</span>
                  </div>
                  <button onClick={() => setCoordOpen(false)} className="text-gray-300 hover:text-gray-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                {coordMsg && (
                  <div className={`mb-3 p-2.5 rounded-xl text-xs font-semibold ${
                    coordMsg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-700"
                  }`}>
                    {coordMsg.type === "success" ? "✅" : "⚠️"} {coordMsg.text}
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">📍 Adresse</label>
                    <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/10 transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">📧 Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/10 transition-all" />
                  </div>
                </div>

                <button onClick={handleSaveCoord} disabled={coordSaving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ backgroundColor: "#0D7377" }}>
                  {coordSaving ? (
                    <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"/>
                    </svg>Sauvegarde...</>
                  ) : "💾 Sauvegarder"}
                </button>
              </div>
            )}
          </div>
        </div>

        {msg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-sm">
            ✅ {msg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { icon: "📝", label: "Contenus",   value: stats.contentCount, href: "/admin/content"  },
            { icon: "💬", label: "Messages",   value: stats.messageCount, href: "/admin/messages" },
            { icon: "🔔", label: "Non lus",    value: stats.unreadCount,  href: "/admin/messages" },
            { icon: "🌐", label: "Site actif", value: "✓",               href: "/"              },
          ].map((s) => (
            <Link key={s.label} href={s.href}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all block">
              <div className="text-2xl sm:text-3xl mb-2">{s.icon}</div>
              <div className="text-xl sm:text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400 font-semibold mt-0.5">{s.label}</div>
            </Link>
          ))}
        </div>

        {/* Mode du site */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900">Mode du site</h2>
              <p className="text-gray-400 text-sm mt-0.5">
                Actif : <span className="font-bold" style={{ color: activeMode.color }}>{activeMode.emoji} {activeMode.label}</span>
              </p>
            </div>
            {saving && <span className="text-sm text-gray-400 animate-pulse">Sauvegarde...</span>}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {MODES.map((m) => (
              <button key={m.id} onClick={() => handleMode(m.id)} disabled={saving}
                className="p-3 sm:p-4 rounded-2xl text-left transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{
                  backgroundColor: mode === m.id ? m.bg : "#f9fafb",
                  border: `2px solid ${mode === m.id ? m.color : "#e5e7eb"}`,
                  boxShadow: mode === m.id ? `0 4px 20px ${m.color}20` : "none",
                }}>
                <div className="text-xl sm:text-2xl mb-1.5">{m.emoji}</div>
                <div className="font-black text-sm" style={{ color: mode === m.id ? m.color : "#374151" }}>{m.label}</div>
                <div className="text-xs text-gray-400 mt-0.5 leading-tight hidden sm:block">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Raccourcis */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            { href: "/admin/announcements", icon: "📢", label: "Gérer les annonces"    },
            { href: "/admin/activities",    icon: "🎯", label: "Gérer les activités"   },
            { href: "/admin/invocations",   icon: "🤲", label: "Gérer les invocations" },
            { href: "/admin/social",        icon: "🌐", label: "Réseaux sociaux"        },
            { href: "/admin/messages",      icon: "💬",
              label: stats.unreadCount > 0 ? `Messages (${stats.unreadCount} non lus)` : "Messages",
              alert: stats.unreadCount > 0 },
            { href: "/admin/content",       icon: "📝", label: "Modifier les contenus" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="bg-white rounded-2xl p-4 sm:p-5 border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3"
              style={{ borderColor: (item as { alert?: boolean }).alert ? "#fca5a5" : "#f3f4f6" }}>
              <span className="text-xl sm:text-2xl">{item.icon}</span>
              <span className="font-bold text-sm" style={{ color: (item as { alert?: boolean }).alert ? "#dc2626" : "#0D7377" }}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </AdminShell>
  );
}
