import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import UserManager from "@/components/admin/UserManager";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true },
    orderBy: { name: "asc" },
  });

  return <UserManager session={session} initialUsers={users} currentUserId={session.user.id} />;
}
