"use client";

import { useState, useEffect, useCallback } from "react";

interface ImageLightboxProps {
  src: string;
  alt?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ImageLightbox({ src, alt = "", children, className = "" }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Fermer avec Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Thumbnail - cliquable */}
      <div onClick={handleClick} className={`cursor-zoom-in ${className}`}>
        {children}
      </div>

      {/* Lightbox Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center animate-fadeIn"
          onClick={handleClose}
        >
          {/* Fond sombre avec blur */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

          {/* Bouton fermer */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full 
              bg-white/10 backdrop-blur-md border border-white/20
              flex items-center justify-center text-white text-2xl
              hover:bg-white/20 hover:scale-110 transition-all duration-300"
            aria-label="Fermer"
          >
            ✕
          </button>

          {/* Image agrandie */}
          <img
            src={src}
            alt={alt}
            className="relative z-10 max-w-[90vw] max-h-[90vh] object-contain rounded-2xl
              shadow-[0_24px_80px_rgba(0,0,0,0.5)]
              animate-slideUp cursor-zoom-out"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          />

          {/* Légende */}
          {alt && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
              <p className="text-white/80 text-sm font-medium bg-black/40 backdrop-blur-md 
                px-6 py-2 rounded-full border border-white/10">
                {alt}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}