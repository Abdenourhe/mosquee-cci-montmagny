"use client";

/**
 * Helper client de lecture de /api/site-mode.
 * Mutualise les appels réseau entre composants :
 *  - une promesse en vol est partagée entre tous les appelants simultanés ;
 *  - le résultat est mis en cache au niveau du module pendant TTL_MS.
 * Le comportement de chaque composant consommateur reste inchangé.
 */

export interface SiteModeData {
  mode?: string;
  invocationsActive?: boolean;
  [key: string]: unknown;
}

const TTL_MS = 30_000; // 30 secondes

let cached: { data: SiteModeData; at: number } | null = null;
let inFlight: Promise<SiteModeData> | null = null;

export function getSiteMode(): Promise<SiteModeData> {
  const now = Date.now();
  if (cached && now - cached.at < TTL_MS) {
    return Promise.resolve(cached.data);
  }
  if (inFlight) return inFlight;

  inFlight = fetch("/api/site-mode")
    .then((r) => r.json())
    .then((data: SiteModeData) => {
      cached = { data, at: Date.now() };
      return data;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/** Invalide le cache (ex. après un changement de mode). */
export function invalidateSiteModeCache(): void {
  cached = null;
}
