"use client";

import { useEffect, useState, useCallback } from "react";
import ImageLightbox from "./ImageLightbox";

interface Photo { id: string; url: string; caption?: string | null }
interface Announcement {
  id: string; title: string; body: string;
  order: number; createdAt: string; photos: Photo[];
}

// ── Icônes SVG ──
function IconCamera({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

function IconMegaphone({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l18-5v12L3 14v-3z"/>
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
    </svg>
  );
}

function IconCalendar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

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

// ── Photo Slider avec Lightbox corrigé ──
function PhotoSlider({ photos, title }: { photos: Photo[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Auto-slide
  useEffect(() => {
    if (photos.length < 2) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [photos.length, next]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (photos.length === 0) return null;

  return (
    <>
      {/* Slider */}
      <div className="relative w-full overflow-hidden rounded-t-[2rem]" style={{ paddingBottom: "56.25%" }}>
        {photos.map((p, i) => (
          <div
            key={p.id}
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{ 
              opacity: i === current ? 1 : 0,
              transform: `translateX(${(i - current) * 100}%)`,
              zIndex: i === current ? 1 : 0
            }}
          >
            {/* IMAGE CLIQUABLE - zone centrale uniquement */}
            <div 
              className="absolute inset-0 cursor-zoom-in"
              onClick={() => openLightbox(i)}
            >
              <img
                src={p.url}
                alt={p.caption ?? title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}

        {/* Overlay gradient - pointer-events-none pour laisser passer le clic */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-[2]" />

        {/* Navigation arrows - z-index plus haut que l'image */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-[5] w-10 h-10 rounded-full
                bg-white/20 backdrop-blur-md border border-white/30
                flex items-center justify-center text-white
                hover:bg-white/30 hover:scale-110 transition-all duration-300"
              aria-label="Photo précédente"
            >
              <IconChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-[5] w-10 h-10 rounded-full
                bg-white/20 backdrop-blur-md border border-white/30
                flex items-center justify-center text-white
                hover:bg-white/30 hover:scale-110 transition-all duration-300"
              aria-label="Photo suivante"
            >
              <IconChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[5] flex gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  backgroundColor: i === current ? "white" : "rgba(255,255,255,0.5)",
                }}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Photo counter */}
        {photos.length > 1 && (
          <div className="absolute top-4 right-4 z-[5] bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {current + 1} / {photos.length}
          </div>
        )}
      </div>

      {/* Lightbox séparé - fonctionne indépendamment du slider */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
          
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full 
              bg-white/10 backdrop-blur-md border border-white/20
              flex items-center justify-center text-white text-2xl
              hover:bg-white/20 hover:scale-110 transition-all duration-300"
            aria-label="Fermer"
          >
            ✕
          </button>

          <img
            src={photos[lightboxIndex].url}
            alt={photos[lightboxIndex].caption ?? title}
            className="relative z-10 max-w-[90vw] max-h-[90vh] object-contain rounded-2xl
              shadow-[0_24px_80px_rgba(0,0,0,0.5)] animate-slideUp cursor-zoom-out"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
          />

          {photos[lightboxIndex].caption && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
              <p className="text-white/80 text-sm font-medium bg-black/40 backdrop-blur-md 
                px-6 py-2 rounded-full border border-white/10">
                {photos[lightboxIndex].caption}
              </p>
            </div>
          )}

          {/* Navigation dans le lightbox */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i - 1 + photos.length) % photos.length);
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full
                  bg-white/10 backdrop-blur-md border border-white/20
                  flex items-center justify-center text-white
                  hover:bg-white/20 transition-all"
              >
                <IconChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i + 1) % photos.length);
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full
                  bg-white/10 backdrop-blur-md border border-white/20
                  flex items-center justify-center text-white
                  hover:bg-white/20 transition-all"
              >
                <IconChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

function TimelineCard({ a, index, isLast }: { a: Announcement; index: number; isLast: boolean }) {
  const date = new Date(a.createdAt).toLocaleDateString("fr-CA", {
    day: "numeric", month: "long", year: "numeric",
  });
  const hasPhotos = a.photos.length > 0;

  return (
    <div className="relative flex gap-6 md:gap-8">
      <div className="flex flex-col items-center flex-shrink-0 w-12 md:w-16">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
          bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-primary-light)]
          text-white shadow-[0_4px_16px_rgba(13,115,119,0.3)]
          border-4 border-white z-10">
          {hasPhotos ? <IconCamera className="w-5 h-5 md:w-6 md:h-6" /> : <IconMegaphone className="w-5 h-5 md:w-6 md:h-6" />}
        </div>
        
        {!isLast && (
          <div className="w-0.5 flex-1 mt-2 bg-gradient-to-b from-[var(--theme-primary)]/40 to-[var(--theme-primary)]/10" />
        )}
      </div>

      <div className="flex-1 pb-10">
        <div className="rounded-[2rem] overflow-hidden bg-white
          shadow-[0_8px_32px_rgba(13,115,119,0.08),0_2px_8px_rgba(13,115,119,0.04)]
          hover:shadow-[0_16px_48px_rgba(13,115,119,0.12),0_6px_16px_rgba(13,115,119,0.08)]
          hover:-translate-y-1 transition-all duration-500
          border border-[var(--theme-primary)]/8">
          
          {hasPhotos && <PhotoSlider photos={a.photos} title={a.title} />}

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-xs font-black px-3 py-1.5 rounded-full text-white 
                bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-primary-light)]
                flex items-center gap-1.5">
                <IconMegaphone className="w-3 h-3" />
                Annonce {index + 1}
              </span>
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <IconCalendar className="w-3 h-3" />
                {date}
              </span>
            </div>

            <h3 className="font-black text-gray-900 text-xl md:text-2xl mb-3 leading-tight">
              {a.title}
            </h3>

            <div className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line" style={{textAlign:"justify"}}>
              {a.body}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAnnouncements(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && announcements.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="space-y-8">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="flex-1 h-40 rounded-[2rem] bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          {announcements.map((a, i) => (
            <TimelineCard 
              key={a.id} 
              a={a} 
              index={i} 
              isLast={i === announcements.length - 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}