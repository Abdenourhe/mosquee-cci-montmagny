"use client";

import { useState } from "react";
import { Session } from "next-auth";
import AdminShell from "./AdminShell";

interface SocialLink { id: string; platform: string; url: string; label: string; active: boolean; order: number }

const PLATFORMS = [
  { value: "facebook",  label: "Facebook",  icon: "📘" },
  { value: "whatsapp",  label: "WhatsApp",  icon: "💬" },
  { value: "instagram", label: "Instagram", icon: "📷" },
  { value: "youtube",   label: "YouTube",   icon: "📺" },
  { value: "telegram",  label: "Telegram",  icon: "✈️" },
  { value: "twitter",   label: "Twitter/X", icon: "🐦" },
  { value: "tiktok",    label: "TikTok",    icon: "🎵" },
];

const PLATFORM_COLORS: Record<string, string> = {
  facebook: "#1877F2", whatsapp: "#25D366", instagram: "#E1306C",
  youtube: "#FF0000", telegram: "#2CA5E0", twitter: "#000000", tiktok: "#010101",
};

const EMPTY = { platform: "facebook", url: "", label: "", active: true, order: 0 };

interface Props { session: Session; initialLinks: SocialLink[] }

export default function SocialManager({ session, initialLinks }: Props) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<SocialLink | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const flash = (type: "success" | "error", text: string) => {
    setMsg({ type, text }); setTimeout(() => setMsg(null), 4000);
  };

  const openAdd = () => { setForm(EMPTY); setSelected(null); setModal("add"); };
  const openEdit = (l: SocialLink) => {
    setForm({ platform: l.platform, url: l.url, label: l.label, active: l.active, order: l.order });
    setSelected(l); setModal("edit");
  };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSave = async () => {
    if (!form.url) return flash("error", "URL requise");
    setSaving(true);
    const isEdit = modal === "edit" && selected;
    const res = await fetch(
      isEdit ? `/api/social/${selected!.id}` : "/api/social",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      if (isEdit) setLinks(links.map((l) => l.id === data.id ? data : l));
      else setLinks([...links, data]);
      closeModal();
      flash("success", isEdit ? "Lien mis à jour !" : "Lien ajouté !");
    } else flash("error", data.error ?? "Erreur");
  };

  const handleToggle = async (link: SocialLink) => {
    const res = await fetch(`/api/social/${link.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !link.active }),
    });
    if (res.ok) { const data = await res.json(); setLinks(links.map((l) => l.id === data.id ? data : l)); }
  };

  const handleDelete = async (link: SocialLink) => {
    if (!confirm(`Supprimer le lien ${link.platform} ?`)) return;
    const res = await fetch(`/api/social/${link.id}`, { method: "DELETE" });
    if (res.ok) { setLinks(links.filter((l) => l.id !== link.id)); flash("success", "Lien supprimé"); }
  };

  return (
    <AdminShell session={session}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Réseaux sociaux</h1>
            <p className="text-gray-500 mt-1">{links.length} lien{links.length !== 1 ? "s" : ""} configuré{links.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 text-white font-bold px-5 py-3 rounded-2xl shadow-md transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: "#0D7377" }}
          >
            <span className="text-lg">+</span> Ajouter un lien
          </button>
        </div>

        {msg && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-semibold ${msg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {msg.type === "success" ? "✅" : "⚠️"} {msg.text}
          </div>
        )}

        {links.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
            <div className="text-5xl mb-4">🌐</div>
            <p className="text-gray-400 font-semibold">Aucun réseau social configuré</p>
            <p className="text-gray-300 text-sm mt-1">Ajoutez vos liens Facebook, WhatsApp, Instagram…</p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => {
              const plat = PLATFORMS.find((p) => p.value === link.platform) ?? { label: link.platform, icon: "🔗" };
              const color = PLATFORM_COLORS[link.platform] ?? "#0D7377";
              return (
                <div key={link.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                  <button
                    onClick={() => handleToggle(link)}
                    className={`w-12 h-6 rounded-full flex-shrink-0 relative transition-all ${link.active ? "bg-emerald-500" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${link.active ? "left-6" : "left-0.5"}`} />
                  </button>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: color + "18" }}
                  >
                    {plat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-gray-900">{link.label || plat.label}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: color + "18", color }}>
                        {plat.label}
                      </span>
                      {!link.active && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Masqué</span>}
                    </div>
                    <a href={link.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-blue-500 truncate block mt-0.5 max-w-xs transition-colors">
                      {link.url}
                    </a>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(link)} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all">
                      ✏️ Éditer
                    </button>
                    <button onClick={() => handleDelete(link)} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">
                {modal === "add" ? "Ajouter un réseau social" : "Modifier le lien"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Plateforme</label>
                <select
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="form-input"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL *</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://facebook.com/cci-montmagny"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Étiquette <span className="font-normal text-gray-400">(optionnel)</span></label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="CCI Montmagny"
                  className="form-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Statut</label>
                  <select value={form.active ? "1" : "0"} onChange={(e) => setForm({ ...form, active: e.target.value === "1" })} className="form-input">
                    <option value="1">✅ Visible</option>
                    <option value="0">🔒 Masqué</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ordre</label>
                  <input type="number" min={0} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="form-input" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={closeModal} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all hover:-translate-y-0.5" style={{ backgroundColor: "#0D7377" }}>
                {saving ? "Enregistrement…" : modal === "add" ? "Ajouter" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
