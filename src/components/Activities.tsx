"use client";

import { useEffect, useState } from "react";

interface Photo { id: string; url: string; caption?: string | null }
interface Activity {
  id: string; icon: string; title: string; desc: string;
  schedule: string; tag: string; colorKey: string; order: number; photos: Photo[];
}

const COLOR_MAP: Record<string, { bg: string; accent: string; border: string; gradient: string }> = {
  green:   { bg: "#EBF9FA", accent: "#0D7377", border: "#B2E4E6", gradient: "from-[#0D7377] to-[#14A0A5]" },
  gold:    { bg: "#FFF8EC", accent: "#C5A059", border: "#F0D9A0", gradient: "from-[#C5A059] to-[#D4B577]" },
  purple:  { bg: "#F5F5FF", accent: "#6366f1", border: "#C7C7F5", gradient: "from-[#6366f1] to-[#8b5cf6]" },
  emerald: { bg: "#F0FAF0", accent: "#16a34a", border: "#A7E8B0", gradient: "from-[#16a34a] to-[#22c55e]" },
  red:     { bg: "#FFF0F0", accent: "#dc2626", border: "#FECACA", gradient: "from-[#dc2626] to-[#ef4444]" },
  blue:    { bg: "#EFF6FF", accent: "#2563eb", border: "#BFDBFE", gradient: "from-[#2563eb] to-[#3b82f6]" },
};

// ── Icônes SVG ──
function IconChevronLeft({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}

function IconChevronRight({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

function IconClock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

// ── Lightbox ──
function Lightbox({ 
  photos, 
  initialIndex, 
  isOpen, 
  onClose, 
  title 
}: { 
  photos: Photo[]; 
  initialIndex: number; 
  isOpen: boolean; 
  onClose: () => void; 
  title: string;
}) {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrent(initialIndex);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrent((i) => (i - 1 + photos.length) % photos.length);
      if (e.key === "ArrowRight") setCurrent((i) => (i + 1) % photos.length);
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, photos.length, onClose]);

  if (!isOpen || photos.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fadeIn" onClick={onClose}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
      
      <button onClick={onClose} className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full 
        bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl
        hover:bg-white/20 hover:scale-110 transition-all duration-300">
        ✕
      </button>

      <img
        src={photos[current].url}
        alt={photos[current].caption ?? title}
        className="relative z-10 max-w-[90vw] max-h-[90vh] object-contain rounded-2xl
          shadow-[0_24px_80px_rgba(0,0,0,0.5)] animate-slideUp cursor-zoom-out"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      />

      {photos[current].caption && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <p className="text-white/80 text-sm font-medium bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
            {photos[current].caption}
          </p>
        </div>
      )}

      {photos.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setCurrent((i) => (i - 1 + photos.length) % photos.length); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full
              bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white
              hover:bg-white/20 transition-all">
            <IconChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setCurrent((i) => (i + 1) % photos.length); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full
              bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white
              hover:bg-white/20 transition-all">
            <IconChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 text-white/60 text-sm font-medium">
            {current + 1} / {photos.length}
          </div>
        </>
      )}
    </div>
  );
}

// ── Masonry Card avec GLISSEMENT VERS LA GAUCHE ──
function MasonryCard({ a, height, index }: { a: Activity; height: number; index: number }) {
  const color = COLOR_MAP[a.colorKey] ?? COLOR_MAP.green;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const hasPhotos = a.photos.length > 0;

  // Animation d&apos;entrée : glissement depuis la gauche
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 150); // Décalage progressif
    return () => clearTimeout(timer);
  }, [index]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div 
        className={`
          rounded-[2rem] overflow-hidden bg-white
          shadow-[0_8px_32px_rgba(13,115,119,0.08),0_2px_8px_rgba(13,115,119,0.04)]
          hover:shadow-[0_16px_48px_rgba(13,115,119,0.15),0_6px_16px_rgba(13,115,119,0.1)]
          hover:-translate-y-2 transition-all duration-500
          border-glow
          break-inside-avoid mb-6
          group
          ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}
        `}
        style={{
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      >
        
        {/* Image */}
        {hasPhotos && (
          <div 
            className="relative w-full overflow-hidden cursor-zoom-in"
            style={{ height }}
            onClick={() => openLightbox(0)}
          >
            <img 
              src={a.photos[0].url} 
              alt={a.photos[0].caption ?? a.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            
            {/* Badge TAG */}
            <span 
              className="absolute top-4 right-4 text-sm font-black px-4 py-2 rounded-xl text-white backdrop-blur-md pointer-events-none shadow-lg"
              style={{ backgroundColor: color.accent + "DD" }}
            >
              {a.tag}
            </span>
            
            {a.photos.length > 1 && (
              <span className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white text-sm font-bold px-3 py-1.5 rounded-full pointer-events-none">
                +{a.photos.length - 1} photos
              </span>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span 
              className="text-sm font-black px-4 py-2 rounded-xl text-white shadow-sm"
              style={{ backgroundColor: color.accent }}
            >
              {a.tag}
            </span>
            <span className="text-sm text-gray-400 font-medium flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl">
              <IconClock className="w-4 h-4" />
              {a.schedule}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-black text-gray-900 text-xl md:text-2xl mb-3 leading-tight">
            {a.title}
          </h3>
          
          {/* Body */}
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-5" style={{textAlign:"justify"}}>
            {a.desc}
          </p>
          
          {/* CTA */}
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-xl text-white
              hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            style={{ background: `linear-gradient(135deg, ${color.accent}, ${color.accent}DD)` }}
          >
            En savoir plus →
          </a>
        </div>
      </div>

      <Lightbox 
        photos={a.photos} 
        initialIndex={lightboxIndex} 
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)} 
        title={a.title}
      />
    </>
  );
}

interface ContentItem { id: string; section: string; title: string | null; body: string; order: number }

interface EventData {
  title: string; body: string; tags: string[];
  emoji: string; arabic: string; arabicLabel: string;
  badge: string; gradient: string; patternId: string;
}

const EV_DEFAULTS: Record<string, Omit<EventData,"title"|"body"|"tags">> = {
  ramadan:  { emoji:"🌙", arabic:"رَمَضَانُ شَهْرٌ مُبَارَكٌ",  arabicLabel:"Ramadan, mois béni",    badge:"Événement spécial annuel", gradient:"from-[var(--theme-hero-from)] via-[var(--theme-hero-to)] to-[var(--theme-primary-light)]", patternId:"pat-ram" },
  eid_fitr: { emoji:"🌟", arabic:"عِيدُ الفِطْرِ مُبَارَكٌ",    arabicLabel:"Aïd el-Fitr béni",      badge:"Fête annuelle",             gradient:"from-amber-800 via-amber-700 to-yellow-600", patternId:"pat-fitr" },
  eid_adha: { emoji:"🐑", arabic:"عِيدُ الأَضْحَى مُبَارَكٌ",  arabicLabel:"Aïd el-Adha béni",      badge:"Fête du sacrifice",          gradient:"from-emerald-900 via-emerald-800 to-teal-700", patternId:"pat-adha" },
};

function EventCard({ data, flip=false }: { data:EventData; flip?:boolean }) {
  const text = (
    <div className="p-8 md:p-12 lg:p-16">
      <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-amber-300 text-sm font-bold mb-8">
        <span>{data.emoji}</span><span>{data.badge}</span>
      </div>
      <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">{data.title}</h3>
      <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8" style={{textAlign:"justify"}}>{data.body}</p>
      <div className="flex flex-wrap gap-3">
        {data.tags.map((t) => (
          <span key={t} className="bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all">{t}</span>
        ))}
      </div>
    </div>
  );
  const visual = (
    <div className="relative flex items-center justify-center p-8 md:p-12 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id={data.patternId} width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon points="30,5 55,17.5 55,42.5 30,55 5,42.5 5,17.5" fill="none" stroke="var(--theme-gold)" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill={`url(#${data.patternId})`}/>
        </svg>
      </div>
      <div className="relative z-10 text-center">
        <div className="text-9xl mb-6 animate-float">{data.emoji}</div>
        <p className="text-2xl md:text-3xl leading-loose font-arabic" dir="rtl" style={{ color:"var(--theme-gold-light)" }}>{data.arabic}</p>
        <p className="text-white/50 text-base mt-3 italic">{data.arabicLabel}</p>
      </div>
    </div>
  );
  return (
    <div className={`rounded-[2.5rem] overflow-hidden bg-gradient-to-br ${data.gradient} shadow-[0_20px_60px_rgba(13,115,119,0.25),0_8px_24px_rgba(13,115,119,0.15)]`}>
      <div className="grid md:grid-cols-2 gap-0">
        {flip ? <>{visual}{text}</> : <>{text}{visual}</>}
      </div>
    </div>
  );
}

function useEv(section: string, defaultTitle: string) {
  const def = EV_DEFAULTS[section];
  const [data, setData] = useState<EventData>({ title:defaultTitle, body:"", tags:[], ...def });
  useEffect(() => {
    fetch(`/api/content?section=${section}`,{ cache:"no-store" }).then(r=>r.json()).then((items:ContentItem[]) => {
      if(!Array.isArray(items)||items.length===0) return;
      const main = items.find(i=>i.title!=="tags"&&i.order===0);
      const tagItem = items.find(i=>i.title==="tags");
      setData(p=>({...p, title:main?.title??p.title, body:main?.body??p.body, tags:tagItem?tagItem.body.split(",").map(t=>t.trim()).filter(Boolean):p.tags}));
    }).catch(()=>{});
  },[section]);
  return data;
}

function EventCards() {
  const ramadan = useEv("ramadan","Ramadan à la CCI");
  const eidFitr = useEv("eid_fitr","Aïd el-Fitr à la CCI");
  const eidAdha = useEv("eid_adha","Aïd el-Adha à la CCI");
  const [show, setShow] = useState<Record<string,boolean>>({ ramadan:true, eid_fitr:true, eid_adha:true });

  useEffect(() => {
    fetch("/api/content?section=events_config", { cache:"no-store" })
      .then(r=>r.json())
      .then((rows:{title:string|null;body:string}[]) => {
        setShow({
          ramadan:   rows.find(r=>r.title==="ramadan_active")?.body   !== "false",
          eid_fitr:  rows.find(r=>r.title==="eid_fitr_active")?.body  !== "false",
          eid_adha:  rows.find(r=>r.title==="eid_adha_active")?.body  !== "false",
        });
      }).catch(()=>{});
  },[]);

  const cards = [
    show.ramadan  && <EventCard key="ram"  data={ramadan} />,
    show.eid_fitr && <EventCard key="fitr" data={eidFitr} flip />,
    show.eid_adha && <EventCard key="adha" data={eidAdha} />,
  ].filter(Boolean);

  if (cards.length === 0) return null;
  return <>{cards}</>;
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setActivities(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 px-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-[2rem] bg-white animate-pulse mb-6 break-inside-avoid" style={{ height: 300 + (i % 3) * 50 }} />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-black text-gray-900 mb-2">Aucune activité pour le moment</h3>
        <p className="text-gray-500">Revenez bientôt pour découvrir nos nouveaux programmes</p>
      </div>
    );
  }

  const heights = [280, 340, 260, 380, 300, 320, 270, 350, 290, 310];

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {activities.map((a, i) => (
            <MasonryCard key={a.id} a={a} height={heights[i % heights.length]} index={i} />
          ))}
        </div>
      </div>

      {/* Événements saisonniers dynamiques */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-8">
        <EventCards />
        <div className="text-center mt-16">
          <p className="text-gray-500 mb-5 text-lg">Intéressé par nos activités ?</p>
          <a href="#contact"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-white text-lg
              bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-primary-light)]
              shadow-[0_8px_24px_rgba(13,115,119,0.3)]
              hover:shadow-[0_12px_32px_rgba(13,115,119,0.4)]
              hover:-translate-y-1 active:translate-y-0 transition-all duration-300">
            <span>Nous rejoindre</span>
            <span className="text-xl">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
