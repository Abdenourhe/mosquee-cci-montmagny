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

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      const isImage = file.type.startsWith("image/");
      const isPdf   = file.type === "application/pdf";

      if (!isImage && !isPdf) continue;

      if (file.size > 20 * 1024 * 1024) {
        return NextResponse.json({ error: `Fichier trop grand: ${file.name} (max 20 Mo)` }, { status: 400 });
      }

      const bytes  = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      let ext = "bin";
      if (isPdf) {
        ext = "pdf";
      } else {
        const raw = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        ext = ["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(raw) ? raw : "jpg";
      }

      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      await writeFile(join(uploadDir, filename), buffer);
      urls.push(`/uploads/${filename}`);
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
