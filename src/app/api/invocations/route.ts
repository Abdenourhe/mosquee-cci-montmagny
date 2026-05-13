import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get("group");

    const invocations = await prisma.invocation.findMany({
      where: group ? { active: true, group } : { active: true },
      orderBy: { order: "asc" },
    });
    
    return NextResponse.json(invocations);
  } catch (error) {
    console.error("GET /api/invocations error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { label, arabic, french, side, active, order, group } = body;
    
    if (!label?.trim() || !arabic?.trim() || !french?.trim()) {
      return NextResponse.json({ error: "label, arabic et french requis" }, { status: 400 });
    }

    const invocation = await prisma.invocation.create({
      data: {
        label: label.trim(),
        arabic: arabic.trim(),
        french: french.trim(),
        side: side ?? "left",
        active: active !== false,
        order: typeof order === "number" ? order : 0,
        group: group ?? "general",
      },
    });
    
    return NextResponse.json(invocation, { status: 201 });
  } catch (error) {
    console.error("POST /api/invocations error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}