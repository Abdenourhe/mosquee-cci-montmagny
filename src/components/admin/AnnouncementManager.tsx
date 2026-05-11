"use client";

import { Session } from "next-auth";
import AdminShell from "./AdminShell";
import { useState, useRef } from "react";

interface Photo { id: string; url: string; caption?: string | null; order: number }
interface Announcement {
  id: string; title: string; body: string;
  active: boolean; order: number; createdAt: string | Date; updatedAt?: string | Date;
  photos: Photo[];
}

const EMPTY: Omit<Announcement, "id" | "photos" | "createdAt"> = {
  title: "", body: "", active: true, order: 0,
};

interface Props {
  session: Session;
  initialAnnouncements: Announcement[];
}

export default function AnnouncementManager({ session, initialAnnouncements }: Props) {
  const [items, setItems] = useState<Announcement[]>(initialAnnouncements);
  const [modal, setModal] = useState<"create" | "edit" | "photos" | null>(null);
  const [current, setCurrent] = useState<Announcement | null>(null);
  const [form, setForm] = useState<Omit<Announcement, "id" | "photos" | "createdAt">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const openCreate = () => {
    setForm(EMPTY);
    setCurrent(null);
    setModal("create");
  };

  const openEdit = (a: Announcement) => {
    setForm({ title: a.title, body: a.body, active: a.active, order: a.order });
    setCurrent(a);
    setModal("edit");
  };

  const openPhotos = (a: Announcement) => {
    setCurrent(a);
    setModal("photos");
  };

  const closeModal = () => { setModal(null); setCurrent(null); };

  /* ── CREATE ── */
  const handleCreate = async () => {
    if (!form.title.trim() || !form.body.trim()) return flash("error", "Titre et contenu requis");
    setSaving(true);
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) { setItems([...items, data]); closeModal(); flash("success", "Annonce créée !"); }
    else flash("error", data.error ?? "Erreur");
  };

  /* ── EDIT ── */
  const handleEdit = async () => {
    if (!current) return;
    setSaving(true);
    const res = await fetch(`/api/announcements/${current.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) { setItems(items.map((a) => a.id === data.id ? data : a)); closeModal(); flash("success", "Annonce mise à jour !"); }
    else flash("error", data.error ?? "Erreur");
  };

  /* ── DELETE ── */
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer l'annonce "${title}" ?`)) return;
    const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    if (res.ok) { setItems(items.filter((a) => a.id !== id)); flash("success", "Annonce supprimée"); }
    else flash("error", "Erreur lors de la suppression");
  };

  /* ── UPLOAD PHOTOS ── */
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !current) return;
    const oversized = Array.from(files).filter((f) => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) return flash("error", `Fichier trop lourd (max 10 Mo) : ${oversized.map(f => f.name).join(", ")}`);
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    const upRes = await fetch("/api/upload", { method: "POST", body: fd });
    if (!upRes.ok) { setUploading(false); return flash("error", "Erreur upload"); }
    const { urls } = await upRes.json();
    const newPhotos: Photo[] = [];
    for (const url of urls) {
      const r = await fetch("/api/announcement-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcementId: current.id, url, order: (current.photos?.length ?? 0) + newPhotos.length }),
      });
      if (r.ok) newPhotos.push(await r.json());
    }
    const updated = { ...current, photos: [...(current.photos ?? []), ...newPhotos] };
    setCurrent(updated);
    setItems(items.map((a) => a.id === current.id ? updated : a));
    flash("success", `${newPhotos.length} photo(s) ajoutée(s)`);
    setUploading(false);
  };

  /* ── DELETE PHOTO ── */
  const handleDeletePhoto = async (photoId: string) => {
    if (!current || !confirm("Supprimer cette photo ?")) return;
    const res = await fetch(`/api/announcement-photos/${photoId}`, { method: "DELETE" });
    if (res.ok) {
      const updated = { ...current, photos: current.photos.filter((p) => p.id !== photoId) };
      setCurrent(updated);
      setItems(items.map((a) => a.id === current.id ? updated : a));
    }
  };

  return (
    <AdminShell session={session}>
      <div>
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Gestion des annonces</h1>
              <p className="text-gray-500 mt-1">{items.length} annonce{items.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={openCreate}
              className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: "var(--theme-primary, #0D7377)" }}>
              <span className="text-lg">+</span> Nouvelle annonce
            </button>
          </div>

          {/* Flash */}
          {msg && (
            <div className={`mb-6 p-4 rounded-2xl text-sm font-semibold ${msg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-700"}`}>
              {msg.type === "success" ? "✅" : "⚠️"} {msg.text}
            </div>
          )}

          {/* List */}
          {items.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
              <div className="text-5xl mb-4">📢</div>
              <p className="text-gray-400 font-semibold">Aucune annonce pour le moment</p>
              <p className="text-gray-300 text-sm mt-1">Cliquez sur « Nouvelle annonce » pour commencer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((a) => (
                <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  {/* Preview panoramic */}
                  {a.photos.length > 0 ? (
                    <div className="w-32 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.photos[0].url} alt="" className="w-full h-full object-cover"/>
                    </div>
                  ) : (
                    <div className="w-32 h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl"
                      style={{ backgroundColor: "rgba(13,115,119,0.08)" }}>📢</div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-black text-gray-900 text-base truncate">{a.title}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                        {a.active ? "Visible" : "Masquée"}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                        {a.photos.length} photo{a.photos.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2">{a.body}</p>
                    <div className="text-gray-300 text-xs mt-1">
                      Ordre : {a.order} · Créée le {new Date(a.createdAt).toLocaleDateString("fr-CA")}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button onClick={() => openPhotos(a)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                      style={{ backgroundColor: "rgba(13,115,119,0.1)", color: "#0D7377" }}>
                      🖼 Photos
                    </button>
                    <button onClick={() => openEdit(a)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all">
                      ✏️ Éditer
                    </button>
                    <button onClick={() => handleDelete(a.id, a.title)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                      🗑 Suppr.
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL CREATE / EDIT ── */}
      {(modal === "create" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-black text-gray-900">
                {modal === "create" ? "➕ Nouvelle annonce" : "✏️ Modifier l'annonce"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Titre *</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "#0D7377" } as React.CSSProperties}
                  placeholder="Ex : Soirée Ramadan 2025"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              {/* Body */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contenu *</label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent"
                  placeholder="Détails de l'annonce…"
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                />
              </div>
              {/* Order + Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ordre d'affichage</label>
                  <input
                    type="number" min={0}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Statut</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    value={form.active ? "1" : "0"}
                    onChange={(e) => setForm({ ...form, active: e.target.value === "1" })}
                  >
                    <option value="1">✅ Visible</option>
                    <option value="0">🔒 Masquée</option>
                  </select>
                </div>
              </div>
              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button onClick={closeModal}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                  Annuler
                </button>
                <button
                  onClick={modal === "create" ? handleCreate : handleEdit}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#0D7377" }}>
                  {saving ? "Enregistrement…" : modal === "create" ? "Créer" : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL PHOTOS ── */}
      {modal === "photos" && current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-black text-gray-900">🖼 Photos — {current.title}</h2>
                <p className="text-gray-400 text-xs mt-0.5">Panoramiques (ratio 16:5) · glissement automatique</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {/* Upload zone */}
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => handleUpload(e.target.files)}/>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed rounded-2xl p-8 text-center transition-all hover:bg-gray-50 mb-6 disabled:opacity-50"
                style={{ borderColor: "#0D737750" }}>
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: "#0D7377" }}/>
                    <span className="text-sm font-semibold text-gray-500">Upload en cours…</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">📁</span>
                    <span className="text-sm font-bold" style={{ color: "#0D7377" }}>Cliquer pour ajouter des photos</span>
                    <span className="text-xs text-gray-400">Plusieurs fichiers acceptés · max 10 Mo chacun · format panoramique recommandé (16:5)</span>
                  </div>
                )}
              </button>

              {/* Photo grid */}
              {current.photos.length === 0 ? (
                <p className="text-center text-gray-300 text-sm py-4">Aucune photo pour cette annonce</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {current.photos.map((p) => (
                    <div key={p.id} className="relative group rounded-xl overflow-hidden" style={{ aspectRatio: "16/5" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={p.caption ?? ""} className="w-full h-full object-cover"/>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => handleDeletePhoto(p.id)}
                          className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center text-lg font-bold hover:bg-red-600 transition-colors">
                          ×
                        </button>
                      </div>
                      {p.caption && (
                        <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-white text-xs font-semibold bg-black/40 truncate">
                          {p.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
