import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DonManager from "@/components/admin/DonManager";

export const dynamic = "force-dynamic";

export default async function DonPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return <DonManager session={session} />;
}
