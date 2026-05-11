import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fixRow(r: any) {
  return {
    ...r,
    active: r.active === 1 || r.active === true || Number(r.active) === 1,
    order: typeof r.order === "bigint" ? Number(r.order) : r.order,
  };
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { category, label, arabic, french, side, active, order } = body;
    const act = active !== false ? 1 : 0;
    await prisma.$executeRaw`UPDATE Invocation SET category=${category}, label=${label}, arabic=${arabic}, french=${french}, side=${side}, active=${act}, "order"=${order} WHERE id=${id}`;
    const rows = await prisma.$queryRaw`SELECT * FROM Invocation WHERE id=${id}` as never[];
    return NextResponse.json(fixRow(rows[0]));
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    if ("active" in body) {
      const act = body.active ? 1 : 0;
      await prisma.$executeRaw`UPDATE Invocation SET active=${act} WHERE id=${id}`;
    }
    if ("order" in body) {
      await prisma.$executeRaw`UPDATE Invocation SET "order"=${body.order} WHERE id=${id}`;
    }
    const rows = await prisma.$queryRaw`SELECT * FROM Invocation WHERE id=${id}` as never[];
    return NextResponse.json(fixRow(rows[0]));
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.$executeRaw`DELETE FROM Invocation WHERE id=${id}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
