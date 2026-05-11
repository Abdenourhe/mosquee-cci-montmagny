"use client";

import { useState } from "react";
import { Session } from "next-auth";
import AdminShell from "./AdminShell";

interface Message {
  id: string; name: string; email: string; phone?: string | null;
  message: string; read: boolean; createdAt: Date | string;
}

interface Props { session: Session; initialMessages: Message[] }

export default function MessagesManager({ session, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<Message | null>(null);

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "read") return m.read;
    return true;
  });
  const unreadCount = messages.filter((m) => !m.read).length;

  const toggleRead = async (msg: Message) => {
    try {
      const res = await fetch(`/api/messages/${msg.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !msg.read }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages(messages.map((m) => m.id === updated.id ? updated : m));
        if (selected?.id === msg.id) setSelected(updated);
      }
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) { setMessages(messages.filter((m) => m.id !== id)); if (selected?.id === id) setSelected(null); }
    } catch { /* ignore */ }
  };

  const openMessage = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) await toggleRead(msg);
  };

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString("fr-CA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <AdminShell session={session} unreadCount={unreadCount}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Messages de contact</h1>
          <p className="text-gray-500 mt-1">{unreadCount} non lu{unreadCount > 1 ? "s" : ""} · {messages.length} au total</p>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "unread", "read"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: filter === f ? "#0D7377" : "white",
                color: filter === f ? "white" : "#374151",
                border: "1px solid",
                borderColor: filter === f ? "#0D7377" : "#e5e7eb",
              }}>
              {f === "all" ? "Tous" : f === "unread" ? "Non lus" : "Lus"}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Liste */}
          <div className="space-y-2">
            {filtered.map((msg) => (
              <div key={msg.id} onClick={() => openMessage(msg)}
                className="bg-white rounded-2xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ borderColor: selected?.id === msg.id ? "#0D7377" : "#e5e7eb", borderWidth: selected?.id === msg.id ? 2 : 1 }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"/>}
                      <span className="font-black text-gray-900 text-sm truncate">{msg.name}</span>
                    </div>
                    <div className="text-gray-400 text-xs mb-0.5">{msg.email}</div>
                    {msg.phone && <div className="text-gray-400 text-xs mb-1">📞 {msg.phone}</div>}
                    <p className="text-gray-600 text-xs line-clamp-2">{msg.message}</p>
                  </div>
                  <div className="text-gray-400 text-xs flex-shrink-0">{formatDate(msg.createdAt)}</div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400">Aucun message</div>}
          </div>

          {/* Détail */}
          {selected ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-8">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-sm font-semibold hover:underline" style={{ color: "#0D7377" }}>{selected.email}</a>
                  {selected.phone && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-sm">📞</span>
                      <a href={`tel:${selected.phone}`} className="text-sm text-gray-500 hover:text-gray-700">{selected.phone}</a>
                    </div>
                  )}
                  <div className="text-gray-400 text-xs mt-1">{formatDate(selected.createdAt)}</div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${selected.read ? "bg-gray-100 text-gray-500" : "bg-emerald-50 text-emerald-700"}`}>
                  {selected.read ? "Lu" : "Non lu"}
                </span>
              </div>
              <div className="p-4 rounded-xl text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-5"
                style={{ backgroundColor: "#f8fafc", border: "1px solid #e5e7eb" }}>
                {selected.message}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => toggleRead(selected)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border border-gray-200 hover:bg-gray-50 text-gray-700 min-w-0">
                  {selected.read ? "Marquer non lu" : "Marquer comme lu"}
                </button>
                <a href={`mailto:${selected.email}`}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-center transition-all min-w-0"
                  style={{ backgroundColor: "#0D7377", color: "white" }}>
                  Répondre
                </a>
                <button onClick={() => handleDelete(selected.id)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                  🗑
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-gray-400 text-sm">Sélectionnez un message pour le lire</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
