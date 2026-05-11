import Image from "next/image";
import Link from "next/link";
import WaveDivider from "./WaveDivider";

const NAV = [
  { href: "#horaires",  label: "Horaires des prières" },
  { href: "#annonces",  label: "Annonces" },
  { href: "#apropos",   label: "À propos" },
  { href: "#activites", label: "Activités" },
  { href: "#don",       label: "Faire un don" },
  { href: "#contact",   label: "Contact" },
];

interface Props { address?: string; email?: string; }

export default function Footer({
  address = "97 Rue St-Jean-Baptiste Est\nMontmagny, QC G5V 1J9, Canada",
  email   = "Montmagny.ccim@gmail.com",
}: Props) {
  const contactItems = [
    { icon: "📍", text: address },
    { icon: "🕐", text: "Ouvert 7j/7\n5 prières quotidiennes" },
    { icon: "📧", text: email },
    { icon: "🕌", text: "Jumaa chaque vendredi" },
  ];

  return (
    <footer className="footer-premium">
      <WaveDivider fill="var(--theme-bg-body)" height={60} flip />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">

          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0">
                <Image src="/ccimontmagny_logo.png" alt="CCI Montmagny" fill className="object-contain p-0.5" />
              </div>
              <div>
                <div className="text-white font-black text-base">CCI DE MONTMAGNY</div>
                <div className="text-xs font-medium text-[var(--theme-gold-light)]">Centre Culturel Islamique</div>
              </div>
            </div>
            <p className="text-white/45 text-sm leading-relaxed mb-5 max-w-xs">
              Un lieu de foi, de partage et de communauté au coeur du Québec. Un espace pour prier, apprendre et grandir ensemble.
            </p>
          </div>

          <div>
            <h4 className="text-[var(--theme-gold-light)] font-black mb-5 text-xs uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2.5">
              {NAV.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-white/45 text-sm hover:text-amber-300 transition-colors flex items-center gap-2">
                    <span className="text-[rgba(197,160,89,0.4)]">›</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[var(--theme-gold-light)] font-black mb-5 text-xs uppercase tracking-widest">Contact</h4>
            <div className="space-y-3 text-sm">
              {contactItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-white/45">
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <span className="leading-relaxed whitespace-pre-line">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="gold-divider mx-8" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/25 text-xs">
          © {new Date().getFullYear()} CCI de Montmagny — Tous droits réservés
        </p>
        <div className="flex items-center gap-4">
          <span className="text-white/20 text-xs" dir="rtl" style={{ fontFamily: "serif" }}>الحمد لله</span>
          <Link href="/admin" className="text-white/20 text-xs hover:text-white/40 transition-colors">⚙ Admin</Link>
        </div>
      </div>
    </footer>
  );
}
