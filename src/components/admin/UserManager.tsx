"use client";

import { Session } from "next-auth";
import { useState } from "react";
import AdminShell from "./AdminShell";

interface AdminUser { id: string; email: string; name: string; role: string }
interface Props { session: Session; initialUsers: AdminUser[]; currentUserId: string }
type Modal = "add" | "edit-email" | "edit-password" | null;

export default function UserManager({ session, initialUsers, currentUserId }: Props) {
  const [users, setUsers]         = useState<AdminUser[]>(initialUsers);
  const [modal, setModal]         = useState<Modal>(null);
  const [selectedUser, setSelected] = useState<AdminUser | null>(null);
  const [form, setForm]           = useState({ name: "", email: "", password: "", confirm: "" });
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState<{ type: "success" | "error"; text: string } | null>(null);

  const flash = (type: "success" | "error", text: string) => {
    setMsg({ type, text }); setTimeout(() => setMsg(null), 4000);
  };

  const openAdd = () => { setForm({ name: "", email: "", password: "", confirm: "" }); setModal("add"); };
  const openEditEmail = (u: AdminUser) => { setSelected(u); setForm({ ...form, email: u.email, name: u.name }); setModal("edit-email"); };
  const openEditPassword = (u: AdminUser) => { setSelected(u); setForm({ ...form, password: "", confirm: "" }); setModal("edit-password"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password) return flash("error", "Tous les champs sont requis");
    if (form.password !== form.confirm) return flash("error", "Les mots de passe ne correspondent pas");
    setSaving(true);
    const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) });
    const data = await res.json(); setSaving(false);
    if (res.ok) { setUsers([...users, data]); closeModal(); flash("success", "Administrateur ajouté !"); }
    else flash("error", data.error ?? "Erreur");
  };

  const handleEditEmail = async () => {
    if (!selectedUser || !form.email) return; setSaving(true);
    const res = await fetch(`/api/users/${selectedUser.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email, name: form.name }) });
    const data = await res.json(); setSaving(false);
    if (res.ok) { setUsers(users.map((u) => u.id === data.id ? data : u)); closeModal(); flash("success", "Informations mises à jour !"); }
    else flash("error", data.error ?? "Erreur");
  };

  const handleEditPassword = async () => {
    if (!selectedUser) return;
    if (form.password !== form.confirm) return flash("error", "Les mots de passe ne correspondent pas");
    if (form.password.length < 8) return flash("error", "Minimum 8 caractères");
    setSaving(true);
    const res = await fetch(`/api/users/${selectedUser.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: form.password }) });
    setSaving(false);
    if (res.ok) { closeModal(); flash("success", "Mot de passe mis à jour !"); }
    else flash("error", "Erreur");
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Supprimer l&apos;administrateur "${user.name}" ?`)) return;
    const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) { setUsers(users.filter((u) => u.id !== user.id)); flash("success", "Administrateur supprimé"); }
    else flash("error", data.error ?? "Erreur");
  };

  return (
    <AdminShell session={session}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Administrateurs</h1>
            <p className="text-gray-500 mt-1">{users.length} compte{users.length > 1 ? "s" : ""} admin</p>
          </div>
          <button onClick={openAdd} className="btn-primary gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Ajouter un admin
          </button>
        </div>

        {msg && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-semibold ${msg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {msg.type === "success" ? "✅" : "⚠️"} {msg.text}
          </div>
        )}

        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-white flex-shrink-0" style={{ backgroundColor: "#0D7377" }}>
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-black text-gray-900">{u.name}</span>
                  {u.id === currentUserId && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "#EBF9FA", color: "#0D7377" }}>Vous</span>
                  )}
                </div>
                <div className="text-gray-400 text-sm">{u.email}</div>
              </div>
              <div className="flex gap-2 flex-shrink-0 flex-wrap">
                <button onClick={() => openEditEmail(u)} className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all" style={{ backgroundColor: "#EBF9FA", color: "#0D7377" }}>
                  ✏️ Email/Nom
                </button>
                <button onClick={() => openEditPassword(u)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all">
                  🔑 Mot de passe
                </button>
                {u.id !== currentUserId && (
                  <button onClick={() => handleDelete(u)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                    🗑 Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal === "add" && (
        <ModalWrapper title="Ajouter un administrateur" onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Nom complet" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Prénom Nom"/>
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="email@example.com"/>
            <Field label="Mot de passe" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} placeholder="Minimum 8 caractères"/>
            <Field label="Confirmer le mot de passe" type="password" value={form.confirm} onChange={(v) => setForm({ ...form, confirm: v })} placeholder="••••••••"/>
          </div>
          <ModalActions onCancel={closeModal} onConfirm={handleAdd} saving={saving} label="Ajouter"/>
        </ModalWrapper>
      )}

      {modal === "edit-email" && selectedUser && (
        <ModalWrapper title={`Modifier — ${selectedUser.name}`} onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Nom complet" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Prénom Nom"/>
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="email@example.com"/>
          </div>
          <ModalActions onCancel={closeModal} onConfirm={handleEditEmail} saving={saving} label="Enregistrer"/>
        </ModalWrapper>
      )}

      {modal === "edit-password" && selectedUser && (
        <ModalWrapper title={`Mot de passe — ${selectedUser.name}`} onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Nouveau mot de passe" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} placeholder="Minimum 8 caractères"/>
            <Field label="Confirmer" type="password" value={form.confirm} onChange={(v) => setForm({ ...form, confirm: v })} placeholder="••••••••"/>
          </div>
          <ModalActions onCancel={closeModal} onConfirm={handleEditPassword} saving={saving} label="Changer"/>
        </ModalWrapper>
      )}
    </AdminShell>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="form-input"/>
    </div>
  );
}

function ModalWrapper({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ModalActions({ onCancel, onConfirm, saving, label }: { onCancel: () => void; onConfirm: () => void; saving: boolean; label: string }) {
  return (
    <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-100">
      <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all">Annuler</button>
      <button onClick={onConfirm} disabled={saving} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
        {saving ? "Enregistrement..." : label}
      </button>
    </div>
  );
}
