import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Vérifier si la photo existe
    const existing = await prisma.activityPhoto.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Photo non trouvée" }, { status: 404 });
    }

    await prisma.activityPhoto.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Photo supprimée" });
  } catch (error) {
    console.error(`DELETE /api/activity-photos/${(await params).id} error:`, error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Vérifier si la photo existe
    const existing = await prisma.activityPhoto.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Photo non trouvée" }, { status: 404 });
    }

    const body = await req.json();
    
    // Validation des champs autorisés
    const allowedFields = ["url", "caption", "order"];
    const updates: Record<string, any> = {};
    
    for (const field of allowedFields) {
      if (field in body) {
        if (field === "url") {
          // Valider l'URL
          try {
            new URL(body[field]);
            updates[field] = body[field].trim();
          } catch {
            return NextResponse.json({ error: "URL invalide" }, { status: 400 });
          }
        } else if (field === "caption") {
          updates[field] = body[field]?.trim() || null;
        } else if (field === "order") {
          updates[field] = typeof body[field] === "number" ? body[field] : 0;
        }
      }
    }

    const photo = await prisma.activityPhoto.update({ 
      where: { id }, 
      data: updates 
    });
    
    return NextResponse.json(photo);
  } catch (error) {
    console.error(`PATCH /api/activity-photos/${(await params).id} error:`, error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}