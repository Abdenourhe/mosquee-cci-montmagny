import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const contents = await prisma.content.findMany({
      where: section ? { section } : {},
      orderBy: [{ section: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(contents);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { section, title, body: bodyText, imageUrl, order } = body;
    if (!section || bodyText == null) {
      return NextResponse.json({ error: "Section et body requis" }, { status: 400 });
    }
    const content = await prisma.content.create({
      data: { section, title, body: bodyText, imageUrl, order: order ?? 0 },
    });
    revalidatePath("/");
    return NextResponse.json(content, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
