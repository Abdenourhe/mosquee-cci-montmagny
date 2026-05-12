import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      if (!isImage && !isPdf) continue;

      if (file.size > 20 * 1024 * 1024) {
        return NextResponse.json({ error: `Fichier trop grand: ${file.name} (max 20 Mo)` }, { status: 400 });
      }

      // Upload vers Vercel Blob
      const blob = await put(file.name, file, {
        access: "public", // ou "public" si tu veux des URLs publiques
        addRandomSuffix: true, // Évite les conflits de noms
      });

      urls.push(blob.url);
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: "Aucun fichier valide (image ou PDF)" }, { status: 400 });
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}