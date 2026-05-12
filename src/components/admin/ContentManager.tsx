"use client";

import { useState, useEffect, useCallback } from "react";
import { Session } from "next-auth";
import AdminShell from "./AdminShell";

interface Item {
  id: string;
  section: string;
  title: string | null;
  body: string;
  order: number;
  updatedAt: string;
}

interface Props { session: Session }

// Seules les sections réellement affichées sur le site public
const SECTIONS = [
  { key: "about",     label: "À propos — Texte",      icon: "🕌", hint: "Paragraphes de présentation de la mosquée" },
  { key: "about_card",label: "À propos — Cartes",     icon: "📋", hint: "Titre format : 🕌 Nom de la carte" },
  { key: "ramadan",   label: "Ramadan",                icon: "🌙", hint: "Ordre 0 = titre/texte principal · ordre 1 = tags (séparés par des virgules)" },
  { key: "eid_fitr",  label: "Aïd el-Fitr",            icon: "🌟", hint: "Ordre 0 = titre/texte principal · ordre 1 = tags (séparés par des virgules)" },
  { key: "eid_adha",  label: "Aïd el-Adha",            icon: "🐑", hint: "Ordre 0 = titre/texte principal · ordre 1 = tags (séparés par des virgules)" },
] as const;

const TEAL = "#0D7377";
const INPUT = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377] transition bg-white";

/* ── Modal ── */
function Modal({ title, secKey, item, onClose, onSaved }: {
  title: string; secKey: string; item?: Item;
  onClose: () => void; onSaved: (saved: Item) => void;
}) {
  const [mTitle, setMTitle] = useState(item?.title ?? "");
  const [mBody,  setMBody]  = useState(item?.body  ?? "");
  const [busy,   setBusy]   = useState(false);
  const [err,    setErr]    = useState("");

  const sec = SECTIONS.find((s) => s.key === secKey);

  const submit = async () => {
    if (!mBody.trim()) { setErr("Le contenu est requis."); return; }
    setBusy(true); setErr("");
    try {
      const isEdit = !!item;
      const url    = isEdit ? `/api/content/${item!.id}` : "/api/content";
      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit
        ? { section: item!.section, title: mTitle.trim() || null, body: mBody.trim(), order: item!.order }
        : { section: secKey, title: mTitle.trim() || null, body: mBody.trim(), order: 0 };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      onSaved(await res.json());
    } catch { setErr("Erreur réseau — veuillez réessayer."); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: TEAL }}>{sec?.icon} {sec?.label}</p>
            <h2 className="text-xl font-black text-gray-900 mt-0.5">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600 text-2xl leading-none transition-colors">×</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl font-semibold">⚠️ {err}</div>}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Titre
              {secKey === "about_card" && <span className="normal-case font-normal text-amber-500 ml-2">ex : 🕌 Lieu de prière</span>}
              {(secKey === "ramadan" || secKey === "eid_fitr" || secKey === "eid_adha") && <span className="normal-case font-normal text-amber-500 ml-2">« tags » pour les étiquettes</span>}
            </label>
            <input type="text" value={mTitle} onChange={(e) => setMTitle(e.target.value)} placeholder="Titre (optionnel)" className={INPUT} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Contenu <span className="text-red-400">*</span>
              {(secKey === "ramadan" || secKey === "eid_fitr" || secKey === "eid_adha") && item?.title === "tags" && (
                <span className="normal-case font-normal text-blue-500 ml-2">Séparer les tags par des virgules</span>
              )}
            </label>
            <textarea rows={6} value={mBody} onChange={(e) => setMBody(e.target.value)} placeholder="Texte du contenu…" className={INPUT + " resize-none"} />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={submit} disabled={busy || !mBody.trim()}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            style={{ backgroundColor: TEAL }}>
            {busy ? "Enregistrement…" : item ? "✓ Sauvegarder" : "+ Ajouter"}
          </button>
          <button onClick={onClose} disabled={busy} className="px-6 py-3 rounded-2xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── ContentManager ── */
export default function ContentManager({ session }: Props) {
  const [items,   setItems]   = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSet, setOpenSet] = useState<Set<string>>(new Set(["about", "about_card"]));
  const [toast,   setToast]   = useState<{ ok: boolean; msg: string } | null>(null);
  const [modal,   setModal]   = useState<{ secKey: string; item?: Item } | null>(null);
  const [evActive, setEvActive] = useState<Record<string,boolean>>({ ramadan:true, eid_fitr:true, eid_adha:true });
  const [evRows,   setEvRows]   = useState<Record<string,Item>>({});
  const [evSaving, setEvSaving] = useState<Record<string,boolean>>({});

  const notify = (ok: boolean, msg: string) => { setToast({ ok, msg }); setTimeout(() => setToast(null), 3500); };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data: Item[] = await res.json();
      setItems(data.filter((i) => i.section !== "site_settings" && i.section !== "events_config"));
      const evData = data.filter((i) => i.section === "events_config");
      const rowMap: Record<string,Item> = {};
      const activeMap: Record<string,boolean> = { ramadan:true, eid_fitr:true, eid_adha:true };
      evData.forEach((r) => {
        if (r.title) {
          rowMap[r.title] = r;
          if (r.title.endsWith("_active")) activeMap[r.title.replace("_active","")] = r.body !== "false";
        }
      });
      setEvRows(rowMap);
      setEvActive(activeMap);
    } catch { notify(false, "Impossible de charger les données."); }
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

  const toggleEvent = async (evKey: string) => {
    const newVal = !evActive[evKey];
    setEvSaving((p) => ({ ...p, [evKey]: true }));
    setEvActive((p) => ({ ...p, [evKey]: newVal }));
    const title = `${evKey}_active`;
    try {
      const existing = evRows[title];
      if (existing) {
        await fetch(`/api/content/${existing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...existing, body: String(newVal) }),
        });
      } else {
        const res = await fetch("/api/content", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section: "events_config", title, body: String(newVal), order: 0 }),
        });
        const created: Item = await res.json();
        setEvRows((p) => ({ ...p, [title]: created }));
      }
    } catch { setEvActive((p) => ({ ...p, [evKey]: !newVal })); }
    finally { setEvSaving((p) => ({ ...p, [evKey]: false })); }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Supprimer ce contenu définitivement ?")) return;
    try {
      const res = await fetch(`/api/content/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((p) => p.filter((x) => x.id !== id));
      notify(true, "Élément supprimé.");
    } catch { notify(false, "Erreur lors de la suppression."); }
  };

  const handleSaved = (saved: Item) => {
    setItems((p) => { const e = p.find((x) => x.id === saved.id); return e ? p.map((x) => x.id === saved.id ? saved : x) : [...p, saved]; });
    setModal(null);
    notify(true, modal?.item ? "Contenu mis à jour !" : "Élément ajouté !");
  };

  const secItems = (key: string) => items.filter((i) => i.section === key).sort((a, b) => a.order - b.order);

  return (
    <AdminShell session={session}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Gestion des contenus</h1>
            <p className="text-sm text-gray-400 mt-1">{items.length} élément{items.length !== 1 ? "s" : ""} · {SECTIONS.length} sections connectées</p>
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
          <div className="space-y-3">{[1,2,3].map((n) => <div key={n} className="bg-white rounded-2xl h-16 animate-pulse border border-gray-100" />)}</div>
        )}

        {/* Sections */}
        {(!loading || items.length > 0) && (
          <div className="space-y-3">
            {SECTIONS.map((sec) => {
              const list   = secItems(sec.key);
              const isOpen = openSet.has(sec.key);
              return (
                <div key={sec.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div role="button" tabIndex={0}
                    onClick={() => toggle(sec.key)}
                    onKeyDown={(e) => e.key==="Enter"&&toggle(sec.key)}
                    className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-gray-50/80 transition-colors text-left gap-3 cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 flex items-center justify-center rounded-xl text-lg flex-shrink-0" style={{ backgroundColor: "#EBF9FA" }}>{sec.icon}</span>
                      <div className="min-w-0">
                        <p className="font-black text-gray-900 text-sm sm:text-base leading-tight">{sec.label}</p>
                        {sec.hint && <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{sec.hint}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {(sec.key === "ramadan" || sec.key === "eid_fitr" || sec.key === "eid_adha") && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleEvent(sec.key); }}
                          disabled={evSaving[sec.key]}
                          title={evActive[sec.key] ? "Désactiver cette carte" : "Activer cette carte"}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all"
                          style={{
                            background: evActive[sec.key] ? "rgba(16,185,129,0.12)" : "rgba(107,114,128,0.1)",
                            border: `1px solid ${evActive[sec.key] ? "rgba(16,185,129,0.4)" : "rgba(107,114,128,0.25)"}`,
                            color: evActive[sec.key] ? "#059669" : "#9ca3af",
                            opacity: evSaving[sec.key] ? 0.5 : 1,
                          }}>
                          <span style={{ fontSize: 10 }}>{evActive[sec.key] ? "●" : "○"}</span>
                          {evActive[sec.key] ? "Visible" : "Masqué"}
                        </button>
                      )}
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full tabular-nums"
                        style={{ backgroundColor: list.length > 0 ? "#EBF9FA" : "#f3f4f6", color: list.length > 0 ? TEAL : "#9ca3af" }}>
                        {list.length}
                      </span>
                      <svg className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-gray-100">
                      {list.length === 0 && <p className="px-5 py-4 text-sm text-gray-400 italic">Aucun élément — cliquez « + Ajouter » pour commencer.</p>}
                      {list.map((item, idx) => (
                        <div key={item.id} className={`flex items-start gap-4 px-4 sm:px-5 py-4 ${idx < list.length - 1 ? "border-b border-gray-50" : ""}`}
                          style={{ backgroundColor: idx % 2 === 0 ? "white" : "#fafafa" }}>
                          <div className="flex-1 min-w-0">
                            {item.title && <p className="font-bold text-gray-900 text-sm mb-1 truncate">{item.title === "tags" ? "🏷 Tags" : item.title}</p>}
                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{item.body}</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0 pt-0.5">
                            <button type="button" onClick={() => setModal({ secKey: sec.key, item })}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80 active:scale-95"
                              style={{ backgroundColor: "#EBF9FA", color: TEAL }}>✏️ Éditer</button>
                            <button type="button" onClick={() => deleteItem(item.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 active:scale-95 transition-all">🗑</button>
                          </div>
                        </div>
                      ))}
                      <div className="px-4 sm:px-5 py-3 border-t border-gray-50">
                        <button type="button" onClick={() => setModal({ secKey: sec.key })}
                          className="text-xs font-bold flex items-center gap-1.5 hover:opacity-70 transition-opacity" style={{ color: TEAL }}>
                          <span className="text-base leading-none">+</span> Ajouter un élément
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
        <Modal title={modal.item ? "Modifier le contenu" : "Nouvel élément"} secKey={modal.secKey}
          item={modal.item} onClose={() => setModal(null)} onSaved={handleSaved} />
      )}
    </AdminShell>
  );
}
