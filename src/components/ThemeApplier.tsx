"use client";

import { useEffect } from "react";

const MODE_CLASSES: Record<string, string> = {
  normal:   "",
  ramadan:  "mode-ramadan",
  eid_fitr: "mode-eid-fitr",
  eid_adha: "mode-eid-adha",
};

export default function ThemeApplier() {
  useEffect(() => {
    const applyTheme = async () => {
      try {
        const res = await fetch("/api/site-mode");
        const data = await res.json();
        const mode = data.mode ?? "normal";

        const html = document.documentElement;
        // Supprimer toutes les classes de mode
        Object.values(MODE_CLASSES).forEach((cls) => {
          if (cls) html.classList.remove(cls);
        });
        // Appliquer la nouvelle classe
        const cls = MODE_CLASSES[mode];
        if (cls) html.classList.add(cls);
      } catch {
        // ignore
      }
    };

    applyTheme();
  }, []);

  return null;
}
