import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { validateUploadedFiles } from "@/lib/upload-validation";

export async function POST(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    // Images + PDF autorisés ici (les khotbas archivées peuvent être des PDF,
    // cf. KhotbaManager.tsx). SVG toujours exclu.
    const validationError = await validateUploadedFiles(files, { allowPdf: true });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      // Upload vers Vercel Blob
      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
      });

      urls.push(blob.url);
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
