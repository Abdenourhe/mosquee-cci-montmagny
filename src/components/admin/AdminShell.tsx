"use client";

import { useState } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Props {
  session: Session;
  children: React.ReactNode;
  unreadCount?: number;
}

const NAV = (unread: number) => [
  { href: "/admin",               icon: "📊", label: "Tableau de bord",   group: "main"    },
  { href: "/admin/announcements", icon: "📢", label: "Annonces",           group: "content" },
  { href: "/admin/activities",    icon: "🎯", label: "Activités",          group: "content" },
  { href: "/admin/invocations",   icon: "🤲", label: "Invocations",        group: "content" },
  { href: "/admin/content",       icon: "📝", label: "Contenus",           group: "content" },
  { href: "/admin/social",        icon: "🌐", label: "Réseaux sociaux",    group: "content" },
  { href: "/admin/don",           icon: "💰", label: "Dons",                group: "content" },
  { href: "/admin/khotba",        icon: "📖", label: "Khotba Jumu'ah",      group: "content" },
  { href: "/admin/messages",      icon: "💬", label: unread > 0 ? `Messages (${unread})` : "Messages", group: "tools" },
  { href: "/affichage",           icon: "📺", label: "Affichage TV",         group: "tools"   },
  { href: "/admin/users",         icon: "👥", label: "Administrateurs",    group: "tools"   },
  { href: "/",                    icon: "🏠", label: "Voir le site",       group: "tools"   },
];

const GROUP_LABELS: Record<string, string> = {
  main: "",
  content: "CONTENU",
  tools: "OUTILS",
};

export default function AdminShell({ session, children, unreadCount = 0 }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = NAV(unreadCount);
  const groups = ["main", "content", "tools"] as const;

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 sm:p-5 border-b flex-shrink-0" style={{ borderColor: "rgba(197,160,89,0.15)" }}>
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white flex-shrink-0">
            <Image src="/ccimontmagny_logo.png" alt="CCI" fill className="object-contain p-0.5" />
          </div>
          <div>
            <div className="text-white font-black text-sm">CCI DE MONTMAGNY</div>
            <div className="text-amber-300 text-xs opacity-80">Administration</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 sm:p-3 overflow-y-auto">
        {groups.map((group) => {
          const items = nav.filter((item) => item.group === group);
          return (
            <div key={group} className="mb-1">
              {GROUP_LABELS[group] && (
                <div className="px-4 pt-3 pb-1 text-[10px] font-black tracking-widest uppercase"
                  style={{ color: "rgba(197,160,89,0.4)" }}>
                  {GROUP_LABELS[group]}
                </div>
              )}
              {items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href) && item.href !== "/";
                const hasUnread = item.href === "/admin/messages" && unreadCount > 0;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-semibold transition-all mb-0.5"
                    style={{
                      backgroundColor: isActive ? "rgba(197,160,89,0.15)" : "transparent",
                      color: isActive ? "#FCD34D" : hasUnread ? "#f87171" : "rgba(255,255,255,0.65)",
                    }}>
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    <span className="truncate flex-1">{item.label}</span>
                    {hasUnread && !isActive && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center flex-shrink-0 font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="p-3 sm:p-4 border-t flex-shrink-0" style={{ borderColor: "rgba(197,160,89,0.15)" }}>
        <div className="flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded-xl mb-2"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#0D7377,#14b8a6)" }}>
            {(session.user?.name ?? "A")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate">{session.user?.name}</div>
            <div className="text-white/40 text-[10px] truncate">{session.user?.email}</div>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-900/20 transition-all">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0f4f8" }}>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 sm:w-64 z-40 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ backgroundColor: "#031F20", borderRight: "1px solid rgba(197,160,89,0.15)" }}>
        <SidebarContent />
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-14 border-b"
        style={{ backgroundColor: "#031F20", borderColor: "rgba(197,160,89,0.15)" }}>
        <button onClick={() => setOpen(true)} className="text-white/80 hover:text-white p-2 rounded-lg -ml-2" aria-label="Ouvrir le menu">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-white">
            <Image src="/ccimontmagny_logo.png" alt="CCI" fill className="object-contain p-0.5" />
          </div>
          <span className="text-white font-black text-sm">Admin CCI</span>
        </div>
        {unreadCount > 0 ? (
          <Link href="/admin/messages" className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Link>
        ) : (
          <div className="w-8" />
        )}
      </header>

      <main className="lg:ml-64 min-h-screen">
        <div className="pt-14 lg:pt-0">
          <div className="p-3 sm:p-5 lg:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
