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
      // Vérifier le type
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        continue;
      }

      // Limite 10 Mo
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: `Fichier trop grand: ${file.name} (max 10 Mo)` }, { status: 400 });
      }

      // Upload vers Vercel Blob
      const blob = await put(file.name, file, {
        access: "private",
        addRandomSuffix: true,
      });

      urls.push(blob.url);
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: "Aucune image ou PDF valide" }, { status: 400 });
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}