import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: { photos: { orderBy: { order: "asc" } } },
    });
    if (!announcement) return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    return NextResponse.json(announcement);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { id: _id, createdAt, updatedAt, photos, ...data } = body;
    void _id; void createdAt; void updatedAt; void photos;
    const announcement = await prisma.announcement.update({
      where: { id },
      data,
      include: { photos: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(announcement);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.announcement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
