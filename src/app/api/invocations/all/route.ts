import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Used by admin to get ALL invocations (including inactive)
export async function GET() {
  try {
    const invocations = await prisma.invocation.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(invocations);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
