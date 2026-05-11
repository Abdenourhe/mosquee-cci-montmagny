import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import InvocationManager from "@/components/admin/InvocationManager";

export const dynamic = "force-dynamic";

export default async function InvocationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return <InvocationManager session={session} />;
}
