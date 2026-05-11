import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(links);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { platform, url, label, active, order } = body;
    if (!platform || !url) {
      return NextResponse.json({ error: "Plateforme et URL requis" }, { status: 400 });
    }
    const link = await prisma.socialLink.create({
      data: {
        platform,
        url,
        label: label ?? "",
        active: active ?? true,
        order: order ?? 0,
      },
    });
    return NextResponse.json(link, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
