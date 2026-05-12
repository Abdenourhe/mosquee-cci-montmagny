"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Photo { id: string; activity: string; url: string; caption?: string | null; order: number }

interface Props { session: Session; initialPhotos: Photo[] }

const ACTIVITY_OPTIONS = [
  { id: "cours-coran",  label: "📖 Cours de Coran" },
  { id: "jeunesse",     label: "⚽ Activités Jeunesse" },
  { id: "conferences",  label: "🎤 Conférences" },
  { id: "evenements",   label: "🌙 Événements Communautaires" },
];

export default function PhotoManager({ session, initialPhotos }: Props) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [form, setForm] = useState({ activity: "cours-coran", url: "", caption: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [preview, setPreview] = useState(false);

  const flash = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const filtered = filter === "all" ? photos : photos.filter((p) => p.activity === filter);

  const handleAdd = async () => {
    if (!form.url.trim()) return flash("error", "L&apos;URL de l&apos;image est requise");
    setSaving(true);
    const res = await fetch("/api/activity-photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activity: form.activity, url: form.url, caption: form.caption || null, order: 0 }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setPhotos([...photos, data]);
      setForm({ activity: "cours-coran", url: "", caption: "" });
      setShowAdd(false);
      flash("success", "Photo ajoutée !");
    } else {
      flash("error", data.error ?? "Erreur");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette photo ?")) return;
    const res = await fetch(`/api/activity-photos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPhotos(photos.filter((p) => p.id !== id));
      flash("success", "Photo supprimée");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0f4f8" }}>

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 z-40 flex flex-col" style={{ backgroundColor: "#031F20", borderRight: "1px solid rgba(197,160,89,0.15)" }}>
        <div className="p-6 border-b" style={{ borderColor: "rgba(197,160,89,0.15)" }}>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden">
              <Image src="/ccimontmagny_logo.png" alt="CCI" fill className="object-contain"/>
            </div>
            <div>
              <div className="text-white font-black text-sm">CCI MONTMAGNY</div>
              <div className="text-amber-300 text-xs">Administration</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/admin",          icon: "📊", label: "Tableau de bord" },
            { href: "/admin/content",  icon: "📝", label: "Contenus" },
            { href: "/admin/messages", icon: "💬", label: "Messages" },
            { href: "/admin/users",    icon: "👥", label: "Administrateurs" },
            { href: "/admin/photos",   icon: "🖼️", label: "Photos activités" },
            { href: "/",               icon: "🌐", label: "Voir le site" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/10" style={{ color: "rgba(255,255,255,0.75)" }}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "rgba(197,160,89,0.15)" }}>
          <div className="px-4 py-3 rounded-xl mb-2" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
            <div className="text-white text-sm font-semibold truncate">{session.user.name}</div>
            <div className="text-white/40 text-xs truncate">{session.user.email}</div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-900/20 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 p-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Photos des activités</h1>
              <p className="text-gray-500 mt-1">{photos.length} photo{photos.length !== 1 ? "s" : ""} au total — carousel visible sur le site</p>
            </div>
            <button onClick={() => setShowAdd(true)} className="btn-primary gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Ajouter une photo
            </button>
          </div>

          {msg && (
            <div className={`mb-6 p-4 rounded-2xl text-sm font-semibold ${msg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-700"}`}>
              {msg.type === "success" ? "✅" : "⚠️"} {msg.text}
            </div>
          )}

          {/* Note URL */}
          <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-sm">
            💡 <strong>Conseil :</strong> Utilisez des URLs d&apos;images publiques (Google Drive ➜ partage public, Imgur, etc.) ou des URLs directes vers des images .jpg / .png / .webp.
          </div>

          {/* Filtres */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button onClick={() => setFilter("all")} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={{ backgroundColor: filter === "all" ? "#0D7377" : "white", color: filter === "all" ? "white" : "#374151", border: "1px solid", borderColor: filter === "all" ? "#0D7377" : "#e5e7eb" }}>
              Toutes ({photos.length})
            </button>
            {ACTIVITY_OPTIONS.map((a) => {
              const count = photos.filter((p) => p.activity === a.id).length;
              return (
                <button key={a.id} onClick={() => setFilter(a.id)} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={{ backgroundColor: filter === a.id ? "#0D7377" : "white", color: filter === a.id ? "white" : "#374151", border: "1px solid", borderColor: filter === a.id ? "#0D7377" : "#e5e7eb" }}>
                  {a.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Grille photos */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-4">🖼️</div>
              <p className="text-gray-400 font-semibold">Aucune photo pour cette activité</p>
              <p className="text-gray-400 text-sm mt-1">Cliquez sur &quot;Ajouter une photo&quot; pour commencer</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => {
                const actLabel = ACTIVITY_OPTIONS.find((a) => a.id === p.activity)?.label ?? p.activity;
                return (
                  <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                    <div className="relative h-40 bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={p.caption ?? "Photo"} className="w-full h-full object-cover"/>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                      >✕</button>
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-bold mb-1" style={{ color: "#0D7377" }}>{actLabel}</div>
                      {p.caption && <p className="text-gray-600 text-xs line-clamp-2">{p.caption}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modale Ajouter */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">Ajouter une photo</h2>
              <button onClick={() => { setShowAdd(false); setPreview(false); }} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Activité *</label>
                <select value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} className="form-input">
                  {ACTIVITY_OPTIONS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL de l&apos;image *</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => { setForm({ ...form, url: e.target.value }); setPreview(false); }}
                  placeholder="https://example.com/image.jpg"
                  className="form-input"
                />
                {form.url && (
                  <button onClick={() => setPreview(true)} className="mt-2 text-xs font-semibold underline" style={{ color: "#0D7377" }}>
                    Prévisualiser l&apos;image
                  </button>
                )}
              </div>
              {preview && form.url && (
                <div className="rounded-xl overflow-hidden h-40 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.url} alt="Prévisualisation" className="w-full h-full object-cover" onError={() => flash("error", "URL invalide ou image inaccessible")}/>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Légende (optionnel)</label>
                <input type="text" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} placeholder="Description de la photo" className="form-input"/>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => { setShowAdd(false); setPreview(false); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">Annuler</button>
              <button onClick={handleAdd} disabled={saving} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
                {saving ? "Ajout..." : "Ajouter la photo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}