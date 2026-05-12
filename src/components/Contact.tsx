"use client";

import { useState, FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactProps {
  address?: string;
  email?: string;
}

const SUBJECTS = [
  { value: "", label: "Choisir un sujet" },
  { value: "priere", label: "🕌 Horaires de prière" },
  { value: "cours", label: "📖 Cours & Éducation" },
  { value: "don", label: "💰 Dons & Contributions" },
  { value: "evenement", label: "🎉 Événements" },
  { value: "benevolat", label: "🤝 Bénévolat" },
  { value: "autre", label: "❓ Autre" },
];

export default function Contact({
  address = "97 Rue St-Jean-Baptiste Est\nMontmagny, QC G5V 1J9, Canada",
  email   = "Montmagny.ccim@gmail.com",
}: ContactProps) {
  const CONTACT_INFO = [
    { icon: "📍", label: "Adresse", value: address },
    { icon: "📧", label: "Email",   value: email   },
    { icon: "🕐", label: "Horaires", value: "Ouvert 7j/7\n5 prières quotidiennes" },
    { icon: "🕌", label: "Jumaa",    value: "Vendredi\nPrière de la communauté" },
  ];
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-5 gap-8">

        {/* Left — Contact Info Cards */}
        <div className="lg:col-span-2 space-y-4">
          {CONTACT_INFO.map((info) => (
            <div key={info.label}
              className="rounded-[1.5rem] p-5 bg-white
                shadow-[0_4px_16px_rgba(13,115,119,0.06)]
                hover:shadow-[0_8px_24px_rgba(13,115,119,0.1)]
                hover:-translate-y-0.5 transition-all duration-300
                border border-[var(--theme-primary)]/8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0
                  bg-gradient-to-br from-[var(--theme-primary)]/10 to-[var(--theme-primary-light)]/10
                  border border-[var(--theme-primary)]/15">
                  {info.icon}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]/60 mb-1">
                    {info.label}
                  </div>
                  <div className="text-gray-700 text-sm font-medium whitespace-pre-line leading-relaxed">
                    {info.value}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Map placeholder */}
          <div className="rounded-[1.5rem] overflow-hidden h-48
            bg-gradient-to-br from-[var(--theme-primary)]/5 to-[var(--theme-primary-light)]/5
            border border-[var(--theme-primary)]/10
            shadow-[0_4px_16px_rgba(13,115,119,0.06)]
            flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-sm text-gray-500">Carte interactive</p>
              <p className="text-xs text-gray-400">Montmagny, Québec</p>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="rounded-[2rem] p-8 md:p-10 bg-white
            shadow-[0_8px_32px_rgba(13,115,119,0.08),0_2px_8px_rgba(13,115,119,0.04)]
            border border-[var(--theme-primary)]/8">
            
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm
                    focus:outline-none focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10
                    transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm
                    focus:outline-none focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10
                    transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(418) 000-0000"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm
                    focus:outline-none focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10
                    transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Sujet *
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm
                    focus:outline-none focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10
                    transition-all appearance-none cursor-pointer"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Votre message..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm
                  focus:outline-none focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10
                  transition-all placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white text-base
                bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-primary-light)]
                hover:shadow-[0_8px_24px_rgba(13,115,119,0.3)]
                hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {status === "sending" ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"/>
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                  Envoyer le message
                </>
              )}
            </button>

            {/* Status messages */}
            {status === "success" && (
              <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                <span className="text-lg">✅</span>
                Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
              </div>
            )}
            {status === "error" && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <span className="text-lg">❌</span>
                Une erreur c&apos;est produite. Veuillez réessayer ou nous contacter directement.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
