"use client";

import { Session } from "next-auth";
import { useState, useEffect } from "react";
import AdminShell from "./AdminShell";
import Link from "next/link";

interface DonStats { collecte: number; objectif: number; interac: string; }
interface Props { session: Session }

export default function ProfileManager({ session }: Props) {
  const [tab, setTab] = useState<"info" | "password" | "dons">("info");
  const [donStats, setDonStats] = useState<DonStats | null>(null);
  const [name,  setName]  = useState(session.user?.name  ?? "");
  const [email, setEmail] = useState(session.user?.email ?? "");
  const [pwd,   setPwd]   = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [flash, setFlash]  = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch(`/api/content?section=don&t=${Date.now()}`).then((r) => r.json()).then((rows: { title: string | null; body: string }[]) => {
      const g = (k: string) => rows.find((r) => r.title === k)?.body;
      setDonStats({
        collecte:  parseFloat(g("collecte")  ?? "0")     || 0,
        objectif:  parseFloat(g("objectif")  ?? "50000") || 50000,
        interac:   g("interac_email") ?? "—",
      });
    }).catch(() => {});
  }, []);

  const showFlash = (type: "success" | "error", text: string) => {
    setFlash({ type, text });
    setTimeout(() => setFlash(null), 4000);
  };

  const saveInfo = async () => {
    setSaving(true);
    try {
      const userId = (session.user as { id?: string }).id;
      if (!userId) { showFlash("error", "Session invalide"); setSaving(false); return; }
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) showFlash("success", "Profil mis à jour ! Reconnectez-vous pour voir les changements.");
      else { const d = await res.json(); showFlash("error", d.error ?? "Erreur"); }
    } catch { showFlash("error", "Erreur réseau"); }
    setSaving(false);
  };

  const savePassword = async () => {
    if (!pwd.next || pwd.next !== pwd.confirm) { showFlash("error", "Les mots de passe ne correspondent pas"); return; }
    if (pwd.next.length < 8) { showFlash("error", "Minimum 8 caractères"); return; }
    setSaving(true);
    try {
      const userId = (session.user as { id?: string }).id;
      if (!userId) { showFlash("error", "Session invalide"); setSaving(false); return; }
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd.next }),
      });
      if (res.ok) { showFlash("success", "Mot de passe modifié !"); setPwd({ current: "", next: "", confirm: "" }); }
      else { const d = await res.json(); showFlash("error", d.error ?? "Erreur"); }
    } catch { showFlash("error", "Erreur réseau"); }
    setSaving(false);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/10 transition-all";
  const labelCls = "block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2";

  return (
    <AdminShell session={session}>
      <div className="max-w-xl mx-auto">

        {/* Avatar + name */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #0D7377, #14b8a6)" }}>
            {(session.user?.name ?? "A")[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">{session.user?.name}</h1>
            <p className="text-gray-400 text-sm">{session.user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#EBF9FA", color: "#0D7377" }}>Administrateur</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-100 pb-1 flex-wrap">
          {([["info", "👤 Informations"], ["password", "🔑 Mot de passe"], ["dons", "💰 Dons"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === id ? "text-white" : "text-gray-400 hover:text-gray-700"}`}
              style={{ backgroundColor: tab === id ? "#0D7377" : "transparent" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Flash */}
        {flash && (
          <div className={`mb-5 p-4 rounded-2xl text-sm font-semibold ${flash.type === "success"
            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
            : "bg-red-50 border border-red-200 text-red-700"}`}>
            {flash.type === "success" ? "✅" : "⚠️"} {flash.text}
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

          {tab === "info" && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Nom complet</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Votre nom" />
              </div>
              <div>
                <label className={labelCls}>Adresse email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="votre@email.com" />
              </div>
              <button onClick={saveInfo} disabled={saving}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{ backgroundColor: "#0D7377" }}>
                {saving ? "Sauvegarde..." : "💾 Sauvegarder"}
              </button>
            </div>
          )}

          {tab === "password" && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Nouveau mot de passe</label>
                <input type="password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} className={inputCls} placeholder="••••••••" />
              </div>
              <div>
                <label className={labelCls}>Confirmer</label>
                <input type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} className={inputCls} placeholder="••••••••" />
              </div>
              <button onClick={savePassword} disabled={saving}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{ backgroundColor: "#0D7377" }}>
                {saving ? "Modification..." : "🔑 Changer le mot de passe"}
              </button>
            </div>
          )}

          {tab === "dons" && (
            <div className="space-y-4">
              {donStats ? (
                <>
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-end justify-between mb-2 flex-wrap gap-1">
                      <div>
                        <div className="text-2xl font-black text-emerald-600">{donStats.collecte.toLocaleString("fr-CA")} $</div>
                        <div className="text-xs text-gray-400">collecté</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-gray-700">{donStats.objectif.toLocaleString("fr-CA")} $</div>
                        <div className="text-xs text-gray-400">objectif</div>
                      </div>
                    </div>
                    {(() => {
                      const pct = Math.min(100, Math.round((donStats.collecte / donStats.objectif) * 100));
                      return (
                        <>
                          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, background: "linear-gradient(90deg,#0D7377,#C5A059)" }} />
                          </div>
                          <div className="text-right text-xs font-black text-amber-600 mt-1">{pct}% atteint</div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Interac */}
                  <div className="rounded-xl px-4 py-3 border" style={{ background: "rgba(13,115,119,0.04)", borderColor: "rgba(13,115,119,0.12)" }}>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Interac</div>
                    <div className="text-sm font-black text-teal-700">{donStats.interac}</div>
                  </div>

                  {/* Restant */}
                  <div className="rounded-xl px-4 py-3 border border-amber-100 bg-amber-50">
                    <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">Reste à collecter</div>
                    <div className="text-lg font-black text-amber-700">
                      {Math.max(0, donStats.objectif - donStats.collecte).toLocaleString("fr-CA")} $
                    </div>
                  </div>

                  <Link href="/admin/don"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: "#0D7377" }}>
                    ✏️ Modifier les dons
                  </Link>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">Chargement des données…</div>
              )}
            </div>
          )}

        </div>
      </div>
    </AdminShell>
  );
}
