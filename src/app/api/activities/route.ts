import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: { photos: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(activities);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { icon, title, desc, schedule, tag, colorKey, order } = body;
    if (!title || !desc) return NextResponse.json({ error: "title et desc requis" }, { status: 400 });
    const activity = await prisma.activity.create({
      data: { icon: icon ?? "🕌", title, desc, schedule: schedule ?? "", tag: tag ?? "", colorKey: colorKey ?? "green", order: order ?? 0 },
      include: { photos: true },
    });
    return NextResponse.json(activity, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
