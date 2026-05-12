"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Session } from "next-auth";
import AdminShell from "@/components/admin/AdminShell";

interface Props { session: Session; }
interface ContentRow { id: string; section: string; title: string | null; body: string; imageUrl: string | null; order: number; }

/* Media item stored as JSON array in imageUrl */
interface MediaItem { url: string; type: "image" | "pdf"; }

function parseMedia(raw: string | null): MediaItem[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr as MediaItem[];
  } catch { /* ignore */ }
  /* Legacy: single URL */
  if (raw.startsWith("/") || raw.startsWith("http")) {
    return [{ url: raw, type: raw.match(/\.pdf$/i) ? "pdf" : "image" }];
  }
  return [];
}

export default function KhotbaManager({ session }: Props) {
  const [rows, setRows]         = useState<ContentRow[]>([]);
  const [values, setValues]     = useState<Record<string, string>>({});
  const [active, setActive]     = useState(true);
  const [archives, setArchives] = useState<ContentRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState<Record<string, boolean>>({});
  const [saved, setSaved]       = useState<Record<string, boolean>>({});
  const [flash, setFlash]       = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* new archive form */
  const [newSujet, setNewSujet]   = useState("");
  const [newDate, setNewDate]     = useState("");
  const [newFiles, setNewFiles]   = useState<File[]>([]);
  const [newUrls, setNewUrls]     = useState<string[]>([]);
  const [newUrlInput, setNewUrlInput] = useState("");
  const [adding, setAdding]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* Editing existing archive media */
  const [editId, setEditId]         = useState<string | null>(null);
  const [editFiles, setEditFiles]   = useState<File[]>([]);
  const [editUrlInput, setEditUrlInput] = useState("");
  const editFileRef = useRef<HTMLInputElement>(null);

  const showFlash = (type: "success" | "error", text: string) => {
    setFlash({ type, text });
    setTimeout(() => setFlash(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [settRes, archRes] = await Promise.all([
        fetch(`/api/content?section=khotba&t=${Date.now()}`).then((r) => r.json()),
        fetch(`/api/content?section=khotba_archive&t=${Date.now()}`).then((r) => r.json()),
      ]);
      const sett: ContentRow[] = settRes;
      const arch: ContentRow[] = archRes;
      setRows(sett);
      const map: Record<string, string> = {};
      sett.forEach((r) => { if (r.title) map[r.title] = r.body; });
      setValues(map);
      setActive(map["active"] !== "0");
      setArchives([...arch].sort((a, b) => a.order - b.order));
    } catch { showFlash("error", "Impossible de charger les données."); }
    finally   { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Save a single khotba setting ── */
  const saveSetting = async (key: string, val: string) => {
    setSaving((p) => ({ ...p, [key]: true }));
    try {
      const existing = rows.find((r) => r.title === key);
      if (existing) {
        await fetch(`/api/content/${existing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...existing, body: val }),
        });
        setRows((p) => p.map((r) => r.id === existing.id ? { ...r, body: val } : r));
      } else {
        const res = await fetch("/api/content", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section: "khotba", title: key, body: val, order: 0 }),
        });
        const created: ContentRow = await res.json();
        setRows((p) => [...p, created]);
      }
      setSaved((p) => ({ ...p, [key]: true }));
      setTimeout(() => setSaved((p) => ({ ...p, [key]: false })), 2500);
    } catch { showFlash("error", "Erreur lors de la sauvegarde."); }
    finally   { setSaving((p) => ({ ...p, [key]: false })); }
  };

  const toggleActive = async () => {
    const next = !active;
    setActive(next);
    await saveSetting("active", next ? "1" : "0");
  };

  /* ── Upload one or many files ── */
  const uploadFiles = async (files: File[]): Promise<MediaItem[]> => {
    const result: MediaItem[] = [];
    for (const file of files) {
      const isPdf = file.type === "application/pdf";
      const fd = new FormData();
      fd.append("files", file);
      const endpoint = isPdf ? "/api/upload-khotba" : "/api/upload";
      const res = await fetch(endpoint, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload échoué : " + file.name);
      const data = await res.json();
      const url = (data.urls?.[0] ?? data.url ?? "") as string;
      if (url) result.push({ url, type: isPdf ? "pdf" : "image" });
    }
    return result;
  };

  /* ── Add archive entry ── */
  const addArchive = async () => {
    if (!newSujet.trim()) { showFlash("error", "Sujet requis."); return; }
    setAdding(true);
    try {
      let mediaItems: MediaItem[] = [];

      if (newFiles.length > 0) {
        setUploading(true);
        mediaItems = await uploadFiles(newFiles);
        setUploading(false);
      }

      /* Add manual URL entries */
      newUrls.forEach((u) => {
        if (u.trim()) mediaItems.push({ url: u.trim(), type: u.match(/\.pdf$/i) ? "pdf" : "image" });
      });

      const imageUrl = mediaItems.length > 0 ? JSON.stringify(mediaItems) : null;

      const res = await fetch("/api/content", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "khotba_archive",
          title: newDate || null,
          body: newSujet.trim(),
          imageUrl,
          order: archives.length,
        }),
      });
      const created: ContentRow = await res.json();
      setArchives((p) => [...p, created]);
      setNewSujet(""); setNewDate(""); setNewFiles([]); setNewUrls([]); setNewUrlInput("");
      showFlash("success", "Khotba ajoutée !");
    } catch { showFlash("error", "Erreur lors de l&apos;ajout."); setUploading(false); }
    finally   { setAdding(false); }
  };

  /* ── Add media to existing archive entry ── */
  const addMediaToArchive = async (archiveRow: ContentRow) => {
    setUploading(true);
    try {
      const existing = parseMedia(archiveRow.imageUrl);
      let newItems: MediaItem[] = [];

      if (editFiles.length > 0) {
        newItems = await uploadFiles(editFiles);
      }
      if (editUrlInput.trim()) {
        const u = editUrlInput.trim();
        newItems.push({ url: u, type: u.match(/\.pdf$/i) ? "pdf" : "image" });
      }

      const merged = [...existing, ...newItems];
      const imageUrl = merged.length > 0 ? JSON.stringify(merged) : null;

      await fetch(`/api/content/${archiveRow.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...archiveRow, imageUrl }),
      });
      setArchives((p) => p.map((r) => r.id === archiveRow.id ? { ...r, imageUrl } : r));
      setEditId(null); setEditFiles([]); setEditUrlInput("");
      showFlash("success", "Fichiers ajoutés !");
    } catch { showFlash("error", "Erreur lors de l&apos;ajout."); }
    finally   { setUploading(false); }
  };

  /* ── Remove one media from existing archive entry ── */
  const removeMediaFromArchive = async (archiveRow: ContentRow, index: number) => {
    const items = parseMedia(archiveRow.imageUrl);
    items.splice(index, 1);
    const imageUrl = items.length > 0 ? JSON.stringify(items) : null;
    try {
      await fetch(`/api/content/${archiveRow.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...archiveRow, imageUrl }),
      });
      setArchives((p) => p.map((r) => r.id === archiveRow.id ? { ...r, imageUrl } : r));
    } catch { showFlash("error", "Erreur."); }
  };

  /* ── Delete archive entry ── */
  const deleteArchive = async (id: string) => {
    if (!confirm("Supprimer cette khotba ?")) return;
    try {
      await fetch(`/api/content/${id}`, { method: "DELETE" });
      setArchives((p) => p.filter((r) => r.id !== id));
      showFlash("success", "Supprimée.");
    } catch { showFlash("error", "Erreur lors de la suppression."); }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white";

  const btnSave = (key: string) => (
    <button
      onClick={() => saveSetting(key, values[key] ?? "")}
      disabled={saving[key]}
      className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
      style={{ background: saved[key] ? "#10b981" : saving[key] ? "#9ca3af" : "linear-gradient(135deg,#0D7377,#14b8a6)" }}
    >
      {saved[key] ? "✓" : saving[key] ? "..." : "Sauvegarder"}
    </button>
  );

  return (
    <AdminShell session={session}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">📖</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">Khotba al-Jumu&apos;ah</h1>
            </div>
            <p className="text-sm text-gray-500 ml-10">Sujet de la prochaine khotba et archives</p>
          </div>
          <button
            onClick={toggleActive}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all"
            style={{
              background: active ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.08)",
              border: active ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.25)",
              color: active ? "#059669" : "#dc2626",
            }}>
            {active ? "✓ Section activée" : "✗ Section désactivée"}
          </button>
        </div>

        {flash && (
          <div className={`mb-4 p-3 rounded-xl text-sm font-semibold ${flash.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {flash.type === "success" ? "✅" : "⚠️"} {flash.text}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ── PROCHAINE KHOTBA ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Prochaine Khotba</div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sujet / Thème</label>
                <div className="flex gap-2">
                  <input value={values["sujet"] ?? ""} onChange={(e) => setValues((p) => ({ ...p, sujet: e.target.value }))}
                    placeholder="Ex: La patience dans l&apos;adversité" className={inputCls} />
                  {btnSave("sujet")}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date (vendredi prochain)</label>
                <div className="flex gap-2">
                  <input type="date" value={values["date_prochaine"] ?? ""} onChange={(e) => setValues((p) => ({ ...p, date_prochaine: e.target.value }))} className={inputCls} />
                  {btnSave("date_prochaine")}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Prédicateur (Khatib) — optionnel</label>
                <div className="flex gap-2">
                  <input value={values["khatib"] ?? ""} onChange={(e) => setValues((p) => ({ ...p, khatib: e.target.value }))}
                    placeholder="Nom de l&apos;imam ou du prédicateur" className={inputCls} />
                  {btnSave("khatib")}
                </div>
              </div>
            </div>

            {/* ── ARCHIVES ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Khotbas passées — Archives</div>
                <p className="text-xs text-gray-400 mt-0.5">Chaque khotba peut avoir plusieurs photos et/ou PDFs</p>
              </div>

              {/* ── Add form ── */}
              <div className="px-5 py-4 bg-teal-50/40 border-b border-gray-100">
                <div className="text-xs font-bold text-teal-700 mb-3">+ Ajouter une khotba archivée</div>

                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">Sujet *</label>
                    <input value={newSujet} onChange={(e) => setNewSujet(e.target.value)}
                      placeholder="Ex: La gratitude envers Allah" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">Date (étiquette)</label>
                    <input value={newDate} onChange={(e) => setNewDate(e.target.value)}
                      placeholder="Ex: 9 mai 2025" className={inputCls} />
                  </div>
                </div>

                {/* File upload */}
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 font-bold mb-1">
                    Fichiers (photos ou PDFs, plusieurs à la fois)
                  </label>
                  <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple
                    onChange={(e) => { if (e.target.files) setNewFiles(Array.from(e.target.files)); }}
                    className="hidden" />
                  <button onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-teal-200 rounded-xl py-3 text-sm text-teal-600 font-bold hover:bg-teal-50 transition-colors">
                    📎 Cliquer pour sélectionner des fichiers
                  </button>
                  {newFiles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newFiles.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-lg font-bold">
                          {f.type === "application/pdf" ? "📄" : "🖼"} {f.name}
                          <button onClick={() => setNewFiles((p) => p.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* URL input */}
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 font-bold mb-1">— ou ajouter URL (Google Drive, lien PDF…)</label>
                  <div className="flex gap-2">
                    <input value={newUrlInput} onChange={(e) => setNewUrlInput(e.target.value)}
                      placeholder="https://..." className={inputCls} />
                    <button onClick={() => {
                      if (newUrlInput.trim()) { setNewUrls((p) => [...p, newUrlInput.trim()]); setNewUrlInput(""); }
                    }} className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                      + Ajouter
                    </button>
                  </div>
                  {newUrls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newUrls.map((u, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-lg font-bold max-w-xs truncate">
                          🔗 {u}
                          <button onClick={() => setNewUrls((p) => p.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 flex-shrink-0">✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={addArchive} disabled={adding || uploading}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: adding ? "#9ca3af" : "linear-gradient(135deg,#0D7377,#14b8a6)" }}>
                  {uploading ? "Envoi des fichiers..." : adding ? "Ajout..." : "+ Ajouter cette khotba"}
                </button>
              </div>

              {/* ── Archive list ── */}
              {archives.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">Aucune archive pour l&apos;instant.</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {archives.map((item) => {
                    const media = parseMedia(item.imageUrl);
                    const isEditing = editId === item.id;
                    return (
                      <div key={item.id} className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                            style={{ background: "rgba(13,115,119,0.08)" }}>
                            📖
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-black text-gray-800">{item.body}</div>
                            {item.title && <div className="text-xs text-gray-400 mt-0.5">{item.title}</div>}

                            {/* Media list */}
                            {media.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {media.map((m, mi) => (
                                  <div key={mi} className="group relative">
                                    {m.type === "image" ? (
                                      <a href={m.url} target="_blank" rel="noopener noreferrer">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={m.url} alt="" className="w-16 h-12 object-cover rounded-lg border border-gray-100" />
                                      </a>
                                    ) : (
                                      <a href={m.url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-bold hover:bg-gray-200 transition-colors">
                                        📄 PDF {mi + 1}
                                      </a>
                                    )}
                                    <button onClick={() => removeMediaFromArchive(item, mi)}
                                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add media to existing entry */}
                            {isEditing && (
                              <div className="mt-3 p-3 bg-teal-50 rounded-xl border border-teal-100">
                                <div className="text-xs font-bold text-teal-700 mb-2">Ajouter des fichiers</div>
                                <input ref={editFileRef} type="file" accept="image/*,application/pdf" multiple
                                  onChange={(e) => { if (e.target.files) setEditFiles(Array.from(e.target.files)); }}
                                  className="hidden" />
                                <button onClick={() => editFileRef.current?.click()}
                                  className="w-full border-2 border-dashed border-teal-200 rounded-lg py-2 text-xs text-teal-600 font-bold hover:bg-teal-100 transition-colors mb-2">
                                  📎 Sélectionner fichiers (photos / PDF)
                                </button>
                                {editFiles.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {editFiles.map((f, i) => (
                                      <span key={i} className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-lg font-bold">
                                        {f.type === "application/pdf" ? "📄" : "🖼"} {f.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <div className="flex gap-2 mb-2">
                                  <input value={editUrlInput} onChange={(e) => setEditUrlInput(e.target.value)}
                                    placeholder="ou coller un URL" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400" />
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => addMediaToArchive(item)} disabled={uploading}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
                                    style={{ background: uploading ? "#9ca3af" : "linear-gradient(135deg,#0D7377,#14b8a6)" }}>
                                    {uploading ? "Envoi..." : "Ajouter"}
                                  </button>
                                  <button onClick={() => { setEditId(null); setEditFiles([]); setEditUrlInput(""); }}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">
                                    Annuler
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            <button onClick={() => { setEditId(isEditing ? null : item.id); setEditFiles([]); setEditUrlInput(""); }}
                              className="text-xs font-bold px-2 py-1 rounded-lg transition-colors"
                              style={{ background: "rgba(13,115,119,0.08)", color: "#0D7377" }}>
                              + Fichiers
                            </button>
                            <button onClick={() => deleteArchive(item.id)}
                              className="text-xs font-bold px-2 py-1 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition-colors">
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}