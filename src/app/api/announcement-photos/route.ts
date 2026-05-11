import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { announcementId, url, caption, order } = body;
    if (!announcementId || !url) {
      return NextResponse.json({ error: "announcementId et url requis" }, { status: 400 });
    }
    const photo = await prisma.announcementPhoto.create({
      data: { announcementId, url, caption: caption ?? null, order: order ?? 0 },
    });
    return NextResponse.json(photo, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
