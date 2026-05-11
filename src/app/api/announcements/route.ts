import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      include: { photos: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(announcements);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, body: bodyText, active, order } = body;
    if (!title || !bodyText) {
      return NextResponse.json({ error: "Titre et contenu requis" }, { status: 400 });
    }
    const announcement = await prisma.announcement.create({
      data: { title, body: bodyText, active: active ?? true, order: order ?? 0 },
      include: { photos: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(announcement, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
