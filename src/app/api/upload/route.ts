import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    // Créer le dossier uploads si nécessaire
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      // Vérifier le type
      if (!file.type.startsWith("image/")) {
        continue;
      }
      // Limite 10 Mo
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: `Fichier trop grand: ${file.name} (max 10 Mo)` }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Nom de fichier unique
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const safe = ["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext) ? ext : "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safe}`;

      await writeFile(join(uploadDir, filename), buffer);
      urls.push(`/uploads/${filename}`);
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: "Aucune image valide" }, { status: 400 });
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
