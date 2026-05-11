import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    let siteMode = await prisma.siteMode.findUnique({ where: { id: "singleton" } });
    if (!siteMode) {
      siteMode = await prisma.siteMode.create({ data: { id: "singleton", mode: "normal" } });
    }
    return NextResponse.json(siteMode);
  } catch {
    return NextResponse.json({ mode: "normal", invocationsActive: true });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { mode, invocationsActive } = body;

    const updateData: Record<string, unknown> = {};

    if (mode !== undefined) {
      const valid = ["normal", "ramadan", "eid_fitr", "eid_adha"];
      if (!valid.includes(mode)) {
        return NextResponse.json({ error: "Mode invalide" }, { status: 400 });
      }
      updateData.mode = mode;
    }

    if (invocationsActive !== undefined) {
      updateData.invocationsActive = Boolean(invocationsActive);
    }

    const siteMode = await prisma.siteMode.upsert({
      where: { id: "singleton" },
      update: updateData,
      create: { id: "singleton", mode: mode ?? "normal", invocationsActive: invocationsActive ?? true },
    });
    return NextResponse.json(siteMode);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
