import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Vérifier si l'activité existe
    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Activité non trouvée" }, { status: 404 });
    }

    const body = await req.json();
    const { id: _id, updatedAt, photos, createdAt, ...data } = body;
    
    // Nettoyage des champs interdits
    void _id; void updatedAt; void photos; void createdAt;

    // Validation des données
    if (data.title && data.title.length > 100) {
      return NextResponse.json({ error: "title trop long (max 100 caractères)" }, { status: 400 });
    }

    const activity = await prisma.activity.update({
      where: { id },
      data: {
        ...data,
        // S'assurer que les champs sont bien formatés
        title: data.title?.trim(),
        desc: data.desc?.trim(),
        schedule: data.schedule?.trim(),
        tag: data.tag?.trim(),
        colorKey: data.colorKey?.trim(),
      },
      include: { 
        photos: { 
          orderBy: { order: "asc" } 
        } 
      },
    });
    
    return NextResponse.json(activity);
  } catch (error) {
    console.error(`PUT /api/activities/${(await params).id} error:`, error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Vérifier si l'activité existe
    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Activité non trouvée" }, { status: 404 });
    }

    // Supprimer d'abord les photos associées (cascade manuel)
    await prisma.activityPhoto.deleteMany({ where: { activityId: id } });
    
    // Puis supprimer l'activité
    await prisma.activity.delete({ where: { id } });
    
    return NextResponse.json({ success: true, message: "Activité et photos supprimées" });
  } catch (error) {
    console.error(`DELETE /api/activities/${(await params).id} error:`, error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}