import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AnnouncementManager from "@/components/admin/AnnouncementManager";

export default async function AnnouncementsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const announcements = await prisma.announcement.findMany({
    orderBy: { order: "asc" },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  return <AnnouncementManager session={session} initialAnnouncements={announcements} />;
}
