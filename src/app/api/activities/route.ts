import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: { 
        photos: { 
          orderBy: { order: "asc" },
          where: { activityId: { not: undefined } } // Sécurité
        } 
      },
    });
    return NextResponse.json(activities);
  } catch (error) {
    console.error("GET /api/activities error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { icon, title, desc, schedule, tag, colorKey, order, active } = body;
    
    // Validation
    if (!title?.trim() || !desc?.trim()) {
      return NextResponse.json({ error: "title et desc requis" }, { status: 400 });
    }
    
    if (title.length > 100) {
      return NextResponse.json({ error: "title trop long (max 100 caractères)" }, { status: 400 });
    }

    const activity = await prisma.activity.create({
      data: { 
        icon: icon?.trim() || "🕌", 
        title: title.trim(), 
        desc: desc.trim(), 
        schedule: schedule?.trim() || "", 
        tag: tag?.trim() || "", 
        colorKey: colorKey?.trim() || "green", 
        order: typeof order === "number" ? order : 0,
        active: typeof active === "boolean" ? active : true,
      },
      include: { 
        photos: { 
          orderBy: { order: "asc" } 
        } 
      },
    });
    
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("POST /api/activities error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}