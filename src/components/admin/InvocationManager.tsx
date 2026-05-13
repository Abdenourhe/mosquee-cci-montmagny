"use client";

import { useState, useEffect, useCallback } from "react";
import { Session } from "next-auth";
import AdminShell from "./AdminShell";

interface Invocation {
  id: string; category: string; label: string;
  arabic: string; french: string; side: string;
  active: boolean; order: number;
}
interface Props { session: Session }

const CATEGORIES = [
  { key: "daily",    label: "Invocations du jour", icon: "☀️",  color: "#0D7377" },
  { key: "ramadan",  label: "Ramadan",              icon: "🌙",  color: "#7C3AED" },
  { key: "eid_fitr", label: "Aïd el-Fitr",          icon: "🌟",  color: "#D97706" },
  { key: "eid_adha", label: "Aïd el-Adha",          icon: "🐑",  color: "#059669" },
  { key: "ashoura",  label: "Ashoura",              icon: "📿",  color: "#DC2626" },
] as const;

const TEAL = "#0D7377";
const INPUT = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377] transition bg-white";

function Modal({ inv, catKey, onClose, onSaved }: {
  inv?: Invocation; catKey: string;
  onClose: () => void; onSaved: (saved: Invocation) => void;
}) {
  const [category, setCategory] = useState(inv?.category ?? catKey);
  const [label,    setLabel]    = useState(inv?.label   ?? "");
  const [arabic,   setArabic]   = useState(inv?.arabic  ?? "");
  const [french,   setFrench]   = useState(inv?.french  ?? "");
  const [side,     setSide]     = useState(inv?.side    ?? "right");
  const [active,   setActive]   = useState(inv?.active  ?? true);
  const [busy,     setBusy]     = useState(false);
  const [err,      setErr]      = useState("");

  const submit = async () => {
    if (!label.trim() || !arabic.trim() || !french.trim()) { setErr("Étiquette, texte arabe et traduction requis."); return; }
    setBusy(true); setErr("");
    try {
      const isEdit = !!inv;
      const res = await fetch(isEdit ? `/api/invocations/${inv!.id}` : "/api/invocations", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, label: label.trim(), arabic: arabic.trim(), french: french.trim(), side, active, order: inv?.order ?? 0 }),
      });
      if (!res.ok) throw new Error();
      onSaved(await res.json());
    } catch { setErr("Erreur réseau — réessayez."); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-4">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900">{inv ? "Modifier l&apos;invocation" : "Nouvelle invocation"}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl font-semibold">⚠️ {err}</div>}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Catégorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={INPUT}>
              {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Étiquette</label>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="ex : Dou&apos;â du matin" className={INPUT} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Texte arabe *</label>
            <textarea rows={4} value={arabic} onChange={(e) => setArabic(e.target.value)} dir="rtl" className={INPUT + " resize-none text-right text-lg leading-loose"} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Traduction française *</label>
            <textarea rows={3} value={french} onChange={(e) => setFrench(e.target.value)} className={INPUT + " resize-none"} />
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Côté</label>
              <select value={side} onChange={(e) => setSide(e.target.value)} className={INPUT}>
                <option value="right">Droite</option>
                <option value="left">Gauche</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4 rounded accent-[#0D7377]" />
                <span className="text-sm font-semibold text-gray-700">Active</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={submit} disabled={busy}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            style={{ backgroundColor: TEAL }}>
            {busy ? "Enregistrement…" : inv ? "✓ Sauvegarder" : "+ Ajouter"}
          </button>
          <button onClick={onClose} disabled={busy} className="px-6 py-3 rounded-2xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InvocationManager({ session }: Props) {
  const [items,   setItems]   = useState<Invocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSet, setOpenSet] = useState<Set<string>>(new Set(["daily"]));
  const [toast,   setToast]   = useState<{ ok: boolean; msg: string } | null>(null);
  const [modal,   setModal]   = useState<{ catKey: string; inv?: Invocation } | null>(null);

  const notify = (ok: boolean, msg: string) => { setToast({ ok, msg }); setTimeout(() => setToast(null), 3500); };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invocations?all=1", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setItems(await res.json());
    } catch { notify(false, "Impossible de charger les invocations."); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const toggle = (key: string) => setOpenSet((p) => { 
  const n = new Set(p); 
  if (n.has(key)) { 
    n.delete(key); 
  } else { 
    n.add(key); 
  } 
  return n; 
  });

  const toggleGroup = async (catKey: string, makeActive: boolean) => {
  const group = items.filter((i) => i.category === catKey);
  if (group.length === 0) {
    notify(false, "Aucune invocation dans cette catégorie.");
    return;
  }
  
  try {
    // Exécuter les PATCH en séquence pour éviter les conflits
    for (const inv of group) {
      const res = await fetch(`/api/invocations/${inv.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: makeActive }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Erreur ${res.status}: ${err.error || 'Unknown'}`);
      }
    }
    
    // Mettre à jour le state immédiatement
    setItems((prev) => prev.map((x) => 
      x.category === catKey ? { ...x, active: makeActive } : x
    ));
    
    const label = CATEGORIES.find((c) => c.key === catKey)?.label ?? catKey;
    notify(true, (makeActive ? label + " activé." : label + " désactivé."));
  } catch (err: any) {
    console.error("toggleGroup error:", err);
    notify(false, "Erreur lors de la mise à jour: " + (err.message || "inconnue"));
    // Recharger les données en cas d'erreur
    fetchAll();
  }
}; 

  const deleteInv = async (id: string) => {
    if (!confirm("Supprimer cette invocation ?")) return;
    try {
      await fetch(`/api/invocations/${id}`, { method: "DELETE" });
      setItems((p) => p.filter((x) => x.id !== id));
      notify(true, "Invocation supprimée.");
    } catch { notify(false, "Erreur."); }
  };

  const toggleActive = async (inv: Invocation) => {
    try {
      const res = await fetch(`/api/invocations/${inv.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !inv.active }),
      });
      const updated = await res.json();
      setItems((p) => p.map((x) => x.id === updated.id ? updated : x));
    } catch { notify(false, "Erreur."); }
  };

  const handleSaved = (saved: Invocation) => {
    setItems((p) => { const e = p.find((x) => x.id === saved.id); return e ? p.map((x) => x.id === saved.id ? saved : x) : [...p, saved]; });
    setModal(null);
    notify(true, modal?.inv ? "Invocation mise à jour !" : "Invocation ajoutée !");
  };

  const catItems = (key: string) => items.filter((i) => i.category === key).sort((a, b) => a.order - b.order);
  const totalActive = items.filter((i) => i.active).length;

  return (
    <AdminShell session={session}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Gestion des invocations</h1>
            <p className="text-sm text-gray-400 mt-1">{items.length} invocations · {totalActive} actives · {CATEGORIES.length} catégories</p>
          </div>
          <button onClick={fetchAll} disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all hover:shadow-md active:scale-95 disabled:opacity-50"
            style={{ color: TEAL, borderColor: TEAL, backgroundColor: "#EBF9FA" }}>
            <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {loading ? "Chargement…" : "Actualiser"}
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`mb-6 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 ${toast.ok ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {toast.ok ? "✅" : "⚠️"} {toast.msg}
          </div>
        )}

        {/* Loading */}
        {loading && items.length === 0 && (
          <div className="space-y-3">{[1,2,3,4,5].map((n) => <div key={n} className="bg-white rounded-2xl h-16 animate-pulse border border-gray-100" />)}</div>
        )}

        {/* Groups */}
        {(!loading || items.length > 0) && (
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const list   = catItems(cat.key);
              const isOpen = openSet.has(cat.key);
              const activeCount = list.filter((i) => i.active).length;
              const allActive = activeCount === list.length && list.length > 0;
              return (
                <div key={cat.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                  {/* Group header */}
                  <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-gray-50">
                    {/* Toggle expand */}
                    <button type="button" onClick={() => toggle(cat.key)}
                      className="flex-1 flex items-center gap-3 min-w-0 text-left py-1">
                      <span className="w-9 h-9 flex items-center justify-center rounded-xl text-lg flex-shrink-0"
                        style={{ backgroundColor: cat.color + "18" }}>{cat.icon}</span>
                      <div className="min-w-0">
                        <p className="font-black text-gray-900 text-sm sm:text-base">{cat.label}</p>
                        <p className="text-xs text-gray-400">{activeCount}/{list.length} active{activeCount > 1 ? "s" : ""}</p>
                      </div>
                    </button>

                    {/* Group activate/deactivate */}
                    {list.length > 0 && (
                      <button type="button"
                        onClick={() => toggleGroup(cat.key, !allActive)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex-shrink-0 ${allActive ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                        {allActive ? "⏸ Désactiver tout" : "▶ Activer tout"}
                      </button>
                    )}

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full tabular-nums flex-shrink-0"
                      style={{ backgroundColor: list.length > 0 ? cat.color + "18" : "#f3f4f6", color: list.length > 0 ? cat.color : "#9ca3af" }}>
                      {list.length}
                    </span>
                    <button type="button" onClick={() => toggle(cat.key)} className="text-gray-300 hover:text-gray-500 p-1">
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>
                  </div>

                  {/* Group body */}
                  {isOpen && (
                    <div>
                      {list.length === 0 && <p className="px-5 py-4 text-sm text-gray-400 italic">Aucune invocation — cliquez « + Ajouter ».</p>}
                      {list.map((inv, idx) => (
                        <div key={inv.id}
                          className={`px-4 sm:px-5 py-4 ${idx < list.length - 1 ? "border-b border-gray-50" : ""} ${!inv.active ? "opacity-50" : ""}`}
                          style={{ backgroundColor: idx % 2 === 0 ? "white" : "#fafafa" }}>
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 text-sm mb-1 truncate">{inv.label}</p>
                              <p className="text-right text-gray-600 text-base leading-loose mb-1" dir="rtl">{inv.arabic}</p>
                              <p className="text-gray-500 text-xs italic line-clamp-2">{inv.french}</p>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-shrink-0 pt-0.5">
                              <button type="button" onClick={() => setModal({ catKey: cat.key, inv })}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 active:scale-95"
                                style={{ backgroundColor: "#EBF9FA", color: TEAL }}>✏️</button>
                              <button type="button" onClick={() => toggleActive(inv)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 ${inv.active ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-500"}`}>
                                {inv.active ? "⏸" : "▶"}
                              </button>
                              <button type="button" onClick={() => deleteInv(inv.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 active:scale-95">🗑</button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="px-4 sm:px-5 py-3 border-t border-gray-50">
                        <button type="button" onClick={() => setModal({ catKey: cat.key })}
                          className="text-xs font-bold flex items-center gap-1.5 hover:opacity-70"
                          style={{ color: cat.color }}>
                          <span className="text-base leading-none">+</span> Ajouter une invocation
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modal && (
        <Modal inv={modal.inv} catKey={modal.catKey} onClose={() => setModal(null)} onSaved={handleSaved} />
      )}
    </AdminShell>
  );
}
