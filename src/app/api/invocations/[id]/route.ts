import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { category, label, arabic, french, side, active, order } = body;

    const existing = await prisma.invocation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Invocation non trouvée" }, { status: 404 });
    }

    const invocation = await prisma.invocation.update({
      where: { id },
      data: {
        category: category ?? existing.category,
        label: label?.trim() ?? existing.label,
        arabic: arabic?.trim() ?? existing.arabic,
        french: french?.trim() ?? existing.french,
        side: side ?? existing.side,
        active: active !== undefined ? active : existing.active,
        order: typeof order === "number" ? order : existing.order,
      },
    });
    
    return NextResponse.json(invocation);
  } catch (error) {
    console.error(`PUT /api/invocations/${(await params).id} error:`, error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.invocation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Invocation non trouvée" }, { status: 404 });
    }

    const updates: Record<string, any> = {};
    if ("active" in body) updates.active = body.active;
    if ("order" in body) updates.order = typeof body.order === "number" ? body.order : 0;

    const invocation = await prisma.invocation.update({
      where: { id },
      data: updates,
    });
    
    return NextResponse.json(invocation);
  } catch (error) {
    console.error(`PATCH /api/invocations/${(await params).id} error:`, error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const existing = await prisma.invocation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Invocation non trouvée" }, { status: 404 });
    }

    await prisma.invocation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/invocations/${(await params).id} error:`, error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}