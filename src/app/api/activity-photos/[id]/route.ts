import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const photos = await prisma.activityPhoto.findMany({
      orderBy: { order: "asc" },
      include: { activity: { select: { id: true, title: true } } },
    });
    return NextResponse.json(photos);
  } catch (error) {
    console.error("GET /api/activity-photos error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { activityId, url, caption, order } = body;
    
    // Validation
    if (!activityId?.trim() || !url?.trim()) {
      return NextResponse.json({ error: "activityId et url requis" }, { status: 400 });
    }

    // Vérifier si l'activité existe
    const activity = await prisma.activity.findUnique({ where: { id: activityId } });
    if (!activity) {
      return NextResponse.json({ error: "Activité non trouvée" }, { status: 404 });
    }

    // Vérifier si l'URL est valide
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "URL invalide" }, { status: 400 });
    }

    const photo = await prisma.activityPhoto.create({
      data: { 
        activityId, 
        url: url.trim(), 
        caption: caption?.trim() || null, 
        order: typeof order === "number" ? order : 0 
      },
    });
    
    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("POST /api/activity-photos error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}