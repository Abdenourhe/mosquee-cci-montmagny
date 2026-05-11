import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const [contentCount, messageCount, unreadCount, settingsRows] = await Promise.all([
    prisma.content.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.content.findMany({ where: { section: "site_settings" } }),
  ]);

  const getSetting = (title: string, fallback: string) =>
    settingsRows.find((r) => r.title === title)?.body ?? fallback;

  return (
    <AdminDashboard
      session={session}
      stats={{ contentCount, messageCount, unreadCount }}
      initialAddress={getSetting("address", "Montmagny, Québec\nG5V 1J9, Canada")}
      initialEmail={getSetting("email", "info@ccimontmagny.ca")}
    />
  );
}
