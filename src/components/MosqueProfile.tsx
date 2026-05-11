const STATS = [
  { value: "5",        unit: "prières",    label: "par jour",           icon: "🕐" },
  { value: "7j/7",     unit: "",           label: "Ouvert toute l\'année", icon: "📅" },
  { value: "Jum\'aa",  unit: "",           label: "Prière du vendredi",  icon: "🕌" },
  { value: "∞",        unit: "",           label: "Communauté unie",     icon: "🤝" },
];

const FEATURES = [
  {
    icon: "🕌",
    title: "Espace de prière",
    body: "Une salle de prière principale accueillant la communauté pour les 5 prières quotidiennes, la Jumu\'aa du vendredi et les prières de fête.",
  },
  {
    icon: "📖",
    title: "École coranique",
    body: "Programme d\'enseignement du Coran, de la langue arabe et des sciences islamiques pour enfants et adultes, tous niveaux.",
  },
  {
    icon: "🤲",
    title: "Aumône & charité",
    body: "Collectes de la Zakat, aide aux familles dans le besoin, colis alimentaires et actions caritatives tout au long de l\'année.",
  },
  {
    icon: "🌙",
    title: "Événements islamiques",
    body: "Célébration du Ramadan, de l\'Aïd el-Fitr et de l\'Aïd el-Adha avec toute la communauté dans la joie et la spiritualité.",
  },
];

export default function MosqueProfile() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {STATS.map((s) => (
          <div key={s.label}
            className="rounded-[1.75rem] p-6 bg-white text-center
              shadow-[0_4px_24px_rgba(13,115,119,0.07)]
              hover:shadow-[0_8px_40px_rgba(13,115,119,0.13)]
              hover:-translate-y-1 transition-all duration-400
              border border-[var(--theme-primary)]/8">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-3xl sm:text-4xl font-black mb-0.5"
              style={{ color: "var(--theme-primary)" }}>
              {s.value}
              {s.unit && <span className="text-lg ml-1 font-bold">{s.unit}</span>}
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURES.map((f, i) => (
          <div key={i}
            className="rounded-[2rem] p-6
              bg-gradient-to-br from-white to-[var(--theme-primary)]/3
              border border-[var(--theme-primary)]/10
              shadow-[0_4px_20px_rgba(13,115,119,0.06)]
              hover:shadow-[0_12px_40px_rgba(13,115,119,0.12)]
              hover:-translate-y-1.5 transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-5
              bg-gradient-to-br from-[var(--theme-primary)]/12 to-[var(--theme-primary-light)]/12">
              {f.icon}
            </div>
            <h3 className="font-black text-gray-900 text-base mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>

      {/* Hadith banner */}
      <div className="mt-12 rounded-[2rem] p-8 sm:p-10 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6"
        style={{
          background: "linear-gradient(135deg, var(--theme-hero-from) 0%, var(--theme-hero-mid) 60%, var(--theme-hero-to) 100%)",
          boxShadow: "0 16px 64px rgba(13,115,119,0.25)",
        }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%"><pattern id="mp-geo" width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon points="30,3 57,16 57,44 30,57 3,44 3,16" fill="none" stroke="white" strokeWidth="0.7"/>
          </pattern><rect width="100%" height="100%" fill="url(#mp-geo)"/></svg>
        </div>
        <div className="relative z-10 flex-1 text-center sm:text-left">
          <div className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "rgba(197,160,89,0.7)" }}>Notre engagement</div>
          <p className="text-white font-bold text-lg sm:text-xl leading-relaxed">
            « Servir Allah et Sa communauté — notre mission depuis notre fondation à Montmagny. »
          </p>
        </div>
        <div className="relative z-10 text-center flex-shrink-0">
          <p className="text-2xl sm:text-3xl leading-loose" dir="rtl"
            style={{ color: "rgba(197,160,89,0.8)", fontFamily: "var(--font-arabic, serif)" }}>
            اللهُ أَكْبَر
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(197,160,89,0.5)" }}>Allahu Akbar</p>
        </div>
      </div>

    </div>
  );
}
