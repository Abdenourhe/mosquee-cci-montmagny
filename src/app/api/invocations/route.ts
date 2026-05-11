import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// SQLite raw queries return BigInt for integers — convert for JSON
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fixRows(rows: any[]): any[] {
  return rows.map((r) => ({
    ...r,
    active: r.active === 1 || r.active === true || Number(r.active) === 1,
    order: typeof r.order === "bigint" ? Number(r.order) : r.order,
  }));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const all = searchParams.get("all");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rows: any[];
    if (category && !all) {
      rows = await prisma.$queryRaw`SELECT * FROM Invocation WHERE active=1 AND category=${category} ORDER BY "order" ASC` as never[];
    } else if (all) {
      rows = await prisma.$queryRaw`SELECT * FROM Invocation ORDER BY category ASC, "order" ASC` as never[];
    } else {
      rows = await prisma.$queryRaw`SELECT * FROM Invocation WHERE active=1 ORDER BY "order" ASC` as never[];
    }
    return NextResponse.json(fixRows(rows));
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { label, arabic, french, side, active, order, category } = body;
    if (!label || !arabic || !french) {
      return NextResponse.json({ error: "label, arabic et french requis" }, { status: 400 });
    }
    const id = crypto.randomUUID();
    const cat = category ?? "daily";
    const s = side ?? "left";
    const act = active !== false ? 1 : 0;
    const ord = order ?? 0;
    await prisma.$executeRaw`INSERT INTO Invocation (id, category, label, arabic, french, side, active, "order") VALUES (${id}, ${cat}, ${label}, ${arabic}, ${french}, ${s}, ${act}, ${ord})`;
    const rows = await prisma.$queryRaw`SELECT * FROM Invocation WHERE id=${id}` as never[];
    return NextResponse.json(fixRows(rows)[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
