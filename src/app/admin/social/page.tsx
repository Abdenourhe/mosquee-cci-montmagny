import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import SocialManager from "@/components/admin/SocialManager";

export default async function SocialPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });

  return <SocialManager session={session} initialLinks={links} />;
}
