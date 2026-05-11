import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import MessagesManager from "@/components/admin/MessagesManager";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MessagesManager session={session} initialMessages={messages} />;
}
