import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileManager from "@/components/admin/ProfileManager";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return <ProfileManager session={session} />;
}
