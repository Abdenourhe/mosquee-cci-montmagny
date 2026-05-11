import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Images : désactive l'optimisation si tu veux un export statique
  // ou laisse par défaut pour Vercel (recommandé)
  images: {
    unoptimized: true, // ← Ajoute ceci si tu as des erreurs d'image en build
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https: http:",
              "frame-src 'self' https://mawaqit.net http://mawaqit.net https://*.mawaqit.net",
              "connect-src 'self' https://mawaqit.net https://*.mawaqit.net",
              "media-src 'self' blob:",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;