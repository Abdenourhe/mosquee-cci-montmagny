import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const invocations = await prisma.invocation.findMany({ 
      orderBy: { order: "asc" } 
    });
    return NextResponse.json(invocations);
  } catch (error) {
    console.error("GET /api/invocations/all error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}