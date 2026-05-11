import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import KhotbaManager from "@/components/admin/KhotbaManager";

export default async function KhotbaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return <KhotbaManager session={session} />;
}
