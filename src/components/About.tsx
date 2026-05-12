interface ContentItem {
  id: string;
  title: string | null;
  body: string;
  order: number;
}

interface AboutProps {
  paragraphs?: ContentItem[];
  cards?: ContentItem[];
}

const DEFAULT_PARAGRAPHS = [
  "CCI de Montmagny (Centre Culturel Islamique) est un lieu de rassemblement pour la communauté musulmane de Montmagny et des régions avoisinantes au Québec, Canada.",
  "Fondée pour servir la communauté, notre mosquée offre un espace de prière, d&apos;apprentissage et de fraternité. Nous sommes engagés à promouvoir les valeurs islamiques de paix, de tolérance et de solidarité.",
  "Notre mission : faciliter la pratique religieuse, éduquer les nouvelles générations et tisser des liens forts avec la communauté québécoise dans le respect mutuel.",
];

const DEFAULT_CARDS = [
  { icon: "🕌", title: "Lieu de prière",       desc: "Un espace sacré ouvert 7j/7 pour les 5 prières quotidiennes et la Jumaa." },
  { icon: "📖", title: "Éducation islamique",   desc: "Cours de Coran, langue arabe et sciences islamiques pour tous les âges." },
  { icon: "🤝", title: "Fraternité",            desc: "Un espace de rencontre qui renforce les liens de la communauté de Montmagny." },
  { icon: "❤️", title: "Action sociale",        desc: "Collectes alimentaires, aide aux familles et actions caritatives toute l&apos;année." },
];

export default function About({ paragraphs = [], cards = [] }: AboutProps) {
  // Paragraphs: filter out old "À propos de la CCI" catch-all, sort by order
  const paras = paragraphs.length > 0
    ? paragraphs
        .sort((a, b) => a.order - b.order)
        .map((p) => p.body)
    : DEFAULT_PARAGRAPHS;

  // Cards: parse "ICON TITLE" from item.title, body = description
  const valueCards = cards.length > 0
    ? cards.sort((a, b) => a.order - b.order).map((c) => {
        // title format: "🕌 Lieu de prière"
        const raw = c.title ?? "";
        const match = raw.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s+(.+)$/u);
        return {
          icon:  match ? match[1] : "📋",
          title: match ? match[2] : raw,
          desc:  c.body,
        };
      })
    : DEFAULT_CARDS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-14 items-start">

        {/* Left — text + Quran card */}
        <div>
          <div className="space-y-4 text-gray-600 text-base leading-relaxed mb-8" style={{textAlign:"justify"}}>
            {paras.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>

          {/* Quran quote card */}
          <div className="rounded-[2rem] p-8 relative overflow-hidden
            bg-gradient-to-br from-[var(--theme-hero-from)] via-[var(--theme-hero-mid)] to-[var(--theme-hero-to)]
            shadow-[0_12px_40px_rgba(13,115,119,0.25),0_4px_12px_rgba(13,115,119,0.1)]">
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="about-geo" width="50" height="50" patternUnits="userSpaceOnUse">
                  <polygon points="25,2 48,13 48,37 25,48 2,37 2,13" fill="none" stroke="var(--theme-gold)" strokeWidth="0.8"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#about-geo)"/>
              </svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📖</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-gold)]/80">
                  Sourate Al-Baqara · 3:103
                </span>
              </div>
              <p className="text-right text-xl leading-loose mb-4" dir="rtl"
                style={{ color: "var(--theme-gold-light)", fontFamily: "var(--font-arabic, serif)" }}>
                وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا
              </p>
              <div className="gold-divider mb-4" />
              <p className="text-white/60 text-sm italic leading-relaxed text-center">
                « Et cramponnez-vous tous ensemble à la corde d&apos;Allah, et ne vous divisez pas. »
              </p>
            </div>
          </div>
        </div>

        {/* Right — value cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {valueCards.map((v, i) => (
            <div key={i}
              className="rounded-[2rem] p-6 bg-white
                shadow-[0_8px_32px_rgba(13,115,119,0.06),0_2px_8px_rgba(13,115,119,0.03)]
                hover:shadow-[0_16px_48px_rgba(13,115,119,0.12),0_6px_16px_rgba(13,115,119,0.08)]
                hover:-translate-y-1.5 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5
                bg-gradient-to-br from-[var(--theme-primary)]/10 to-[var(--theme-primary-light)]/10 shadow-inner">
                {v.icon}
              </div>
              <h3 className="font-black text-gray-900 mb-2 text-lg">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
