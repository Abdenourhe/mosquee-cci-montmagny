import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(_req: NextRequest, context: any) {
  try {
    const { id } = await context.params;
    
    const existing = await prisma.activityPhoto.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Photo non trouvée" }, { status: 404 });
    }

    await prisma.activityPhoto.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(req: NextRequest, context: any) {
  try {
    const { id } = await context.params;
    
    const existing = await prisma.activityPhoto.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Photo non trouvée" }, { status: 404 });
    }

    const body = await req.json();
    const photo = await prisma.activityPhoto.update({ where: { id }, data: body });
    return NextResponse.json(photo);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}