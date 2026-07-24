import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — CCI de Montmagny",
  description: "Tableau de bord d'administration",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}