"use client";

import { Session } from "next-auth";
import AdminShell from "./AdminShell";
import { useState, useRef } from "react";

interface Photo { id: string; url: string; caption?: string | null; order: number }
interface Activity {
  id: string; icon: string; title: string; desc: string;
  schedule: string; tag: string; colorKey: string; order: number; active: boolean;
  photos: Photo[];
}

const COLOR_OPTIONS = [
  { key: "green",   label: "Vert islamique", bg: "#EBF9FA", accent: "#0D7377" },
  { key: "gold",    label: "Or",             bg: "#FFF8EC", accent: "#C5A059" },
  { key: "purple",  label: "Violet",         bg: "#F5F5FF", accent: "#6366f1" },
  { key: "emerald", label: "Émeraude",       bg: "#F0FAF0", accent: "#16a34a" },
  { key: "red",     label: "Rouge",          bg: "#FFF0F0", accent: "#dc2626" },
  { key: "blue",    label: "Bleu",           bg: "#EFF6FF", accent: "#2563eb" },
];

const ICONS = ["📖","⚽","🎤","🌙","🕌","🎓","🤝","🍽️","🏃","🎨","📿","💡","🌟","❤️","🤲","🧕","👦","🐑","🎉","🕋","🌿","🏠","📢","🤲🏽"];

const EMPTY: Omit<Activity, "id" | "photos"> = { icon: "🕌", title: "", desc: "", schedule: "", tag: "", colorKey: "green", order: 0, active: true };

export default function ActivityManager({ session, initialActivities }: { session: Session; initialActivities: Activity[] }) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [editing, setEditing] = useState<(Omit<Activity, "id" | "photos"> & { id?: string; photos?: Photo[] }) | null>(null);
  const [photosActivity, setPhotosActivity] = useState<Activity | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  // ── Activités CRUD ──────────────────────────────
  const openCreate = () => setEditing({ ...EMPTY });
  const openEdit   = (a: Activity) => setEditing({ ...a });

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.desc.trim()) return flash("error", "Titre et description requis");
    setSaving(true);

    const isNew = !editing.id;
    const url   = isNew ? "/api/activities" : `/api/activities/${editing.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      if (isNew) setActivities([...activities, data]);
      else setActivities(activities.map((a) => (a.id === data.id ? data : a)));
      setEditing(null);
      flash("success", isNew ? "Activité créée !" : "Activité mise à jour !");
    } else {
      flash("error", data.error ?? "Erreur");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette activité et toutes ses photos ?")) return;
    const res = await fetch(`/api/activities/${id}`, { method: "DELETE" });
    if (res.ok) {
      setActivities(activities.filter((a) => a.id !== id));
      flash("success", "Activité supprimée");
    }
  };

  // ── Photos ──────────────────────────────────────
  const openPhotos = (a: Activity) => setPhotosActivity({ ...a });

  const handleUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!photosActivity || !e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    Array.from(e.target.files).forEach((f) => formData.append("files", f));

    const upRes = await fetch("/api/upload", { method: "POST", body: formData });
    const upData = await upRes.json();
    if (!upRes.ok) { flash("error", upData.error ?? "Erreur upload"); setUploading(false); return; }

    // Attacher chaque URL à l'activité
    const newPhotos: Photo[] = [];
    for (const url of upData.urls as string[]) {
      const pRes = await fetch("/api/activity-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId: photosActivity.id, url, order: photosActivity.photos.length + newPhotos.length }),
      });
      if (pRes.ok) newPhotos.push(await pRes.json());
    }

    const updatedPhotos = [...photosActivity.photos, ...newPhotos];
    setPhotosActivity({ ...photosActivity, photos: updatedPhotos });
    setActivities(activities.map((a) => a.id === photosActivity.id ? { ...a, photos: updatedPhotos } : a));
    setUploading(false);
    flash("success", `${newPhotos.length} photo${newPhotos.length > 1 ? "s" : ""} ajoutée${newPhotos.length > 1 ? "s" : ""} !`);

    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!photosActivity) return;
    const res = await fetch(`/api/activity-photos/${photoId}`, { method: "DELETE" });
    if (res.ok) {
      const updatedPhotos = photosActivity.photos.filter((p) => p.id !== photoId);
      setPhotosActivity({ ...photosActivity, photos: updatedPhotos });
      setActivities(activities.map((a) => a.id === photosActivity.id ? { ...a, photos: updatedPhotos } : a));
    }
  };

  return (
    <AdminShell session={session}>
      <div>
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Gestion des activités</h1>
              <p className="text-gray-500 mt-1">{activities.length} activité{activities.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={openCreate} className="btn-primary gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Nouvelle activité
            </button>
          </div>

          {msg && (
            <div className={`mb-6 p-4 rounded-2xl text-sm font-semibold ${msg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-700"}`}>
              {msg.type === "success" ? "✅" : "⚠️"} {msg.text}
            </div>
          )}

          {/* Liste activités */}
          <div className="space-y-3">
            {activities.map((a) => {
              const color = COLOR_OPTIONS.find((c) => c.key === a.colorKey) ?? COLOR_OPTIONS[0];
              return (
                <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: color.bg, border: `1px solid ${color.accent}30` }}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-black text-gray-900">{a.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: color.bg, color: color.accent }}>{a.tag}</span>
                      <span className="text-xs text-gray-400">· {a.schedule}</span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-1">{a.desc}</p>
                    <div className="text-gray-400 text-xs mt-1">📷 {a.photos.length} photo{a.photos.length !== 1 ? "s" : ""}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openPhotos(a)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-50 text-violet-700 hover:bg-violet-100 transition-all">📷 Photos</button>
                    <button onClick={() => openEdit(a)} className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all" style={{ backgroundColor: "#EBF9FA", color: "#0D7377" }}>✏️ Éditer</button>
                    <button onClick={() => handleDelete(a.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all">🗑</button>
                  </div>
                </div>
              );
            })}
            {activities.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-4">🎯</div>
                <p className="text-gray-400 font-semibold">Aucune activité</p>
                <p className="text-gray-400 text-sm mt-1">Cliquez sur &quot;Nouvelle activité&quot; pour commencer</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modale Créer/Éditer activité ─────────── */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-black text-gray-900">{editing.id ? "Modifier l'activité" : "Nouvelle activité"}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Icône */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Icône</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((ico) => (
                    <button key={ico} onClick={() => setEditing({ ...editing, icon: ico })} className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all" style={{ backgroundColor: editing.icon === ico ? "#EBF9FA" : "#f9fafb", border: `2px solid ${editing.icon === ico ? "#0D7377" : "#e5e7eb"}` }}>
                      {ico}
                    </button>
                  ))}
                </div>
              </div>
              {/* Titre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Titre *</label>
                <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="form-input" placeholder="Nom de l'activité"/>
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea rows={3} value={editing.desc} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} className="form-input resize-none" placeholder="Décrivez l'activité..."/>
              </div>
              {/* Schedule + Tag */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Horaire</label>
                  <input type="text" value={editing.schedule} onChange={(e) => setEditing({ ...editing, schedule: e.target.value })} className="form-input" placeholder="Sam & Dim"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Étiquette</label>
                  <input type="text" value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} className="form-input" placeholder="Éducation"/>
                </div>
              </div>
              {/* Couleur */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Couleur de la carte</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button key={c.key} onClick={() => setEditing({ ...editing, colorKey: c.key })} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all" style={{ backgroundColor: c.bg, border: `2px solid ${editing.colorKey === c.key ? c.accent : "transparent"}`, color: c.accent }}>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.accent }}/>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Ordre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ordre d&apos;affichage</label>
                <input type="number" min={0} value={editing.order} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })} className="form-input"/>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
                {saving ? "Enregistrement..." : (editing.id ? "Mettre à jour" : "Créer")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modale Photos d'une activité ─────────── */}
      {photosActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-black text-gray-900">Photos — {photosActivity.title}</h2>
                <p className="text-gray-400 text-sm">{photosActivity.photos.length} photo{photosActivity.photos.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setPhotosActivity(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="p-6">
              {/* Zone upload */}
              <div
                className="border-2 border-dashed rounded-2xl p-8 text-center mb-6 transition-all hover:border-emerald-400 cursor-pointer"
                style={{ borderColor: "#0D7377" }}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUploadPhotos}/>
                <div className="text-4xl mb-3">{uploading ? "⏳" : "📤"}</div>
                <p className="font-bold text-gray-700 mb-1">{uploading ? "Upload en cours..." : "Cliquez pour ajouter des photos"}</p>
                <p className="text-gray-400 text-sm">JPG, PNG, WEBP — plusieurs fichiers acceptés — max 10 Mo chacun</p>
              </div>

              {/* Grille photos */}
              {photosActivity.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photosActivity.photos.map((p) => (
                    <div key={p.id} className="relative group rounded-xl overflow-hidden bg-gray-100" style={{ height: 140 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={p.caption ?? "Photo"} className="w-full h-full object-cover"/>
                      <button
                        onClick={() => handleDeletePhoto(p.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                      >✕</button>
                      {p.caption && (
                        <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-white text-xs" style={{ background: "rgba(0,0,0,0.5)" }}>{p.caption}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-sm">Aucune photo pour cette activité</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </AdminShell>
  );
}
