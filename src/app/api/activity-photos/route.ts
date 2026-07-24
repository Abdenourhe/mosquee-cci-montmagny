import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  try {
    const body = await req.json();
    const { activityId, url, caption, order } = body;
    if (!activityId || !url) {
      return NextResponse.json({ error: "activityId et url requis" }, { status: 400 });
    }
    const photo = await prisma.activityPhoto.create({
      data: { activityId, url, caption: caption ?? null, order: order ?? 0 },
    });
    return NextResponse.json(photo, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}