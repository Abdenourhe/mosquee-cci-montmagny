import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic, Amiri } from "next/font/google";
import "./globals.css";
import ThemeApplier from "@/components/ThemeApplier";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter", 
  display: "swap" 
});

const notoSansArabic = Noto_Sans_Arabic({ 
  subsets: ["arabic"], 
  variable: "--font-noto-arabic", 
  display: "swap", 
  weight: ["400", "600", "700", "800"] 
});

const amiri = Amiri({ 
  subsets: ["arabic"], 
  variable: "--font-amiri", 
  display: "swap", 
  weight: ["400", "700"] 
});

export const metadata: Metadata = {
  title: "CCI de Montmagny — Centre Culturel Islamique",
  description: "Centre Culturel Islamique de Montmagny, Québec. Horaires des prières, activités communautaires, cours de Coran et événements islamiques.",
  keywords: ["mosquée", "Montmagny", "islam", "CCI", "prières", "Québec"],
  openGraph: {
    title: "CCI de Montmagny",
    description: "Un lieu de foi, de partage et de communauté au cœur du Québec",
    locale: "fr_CA",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${notoSansArabic.variable} ${amiri.variable}`}>
      <body>
        <ThemeApplier />
        {children}
      </body>
    </html>
  );
}