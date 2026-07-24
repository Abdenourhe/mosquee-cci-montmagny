/**
 * Validation partagée des uploads de fichiers (routes /api/upload et
 * /api/upload-khotba). La détection du type repose sur les magic bytes
 * du contenu, jamais sur file.type ni sur l'extension fournies par le client.
 * Le SVG est explicitement exclu (risque de XSS via script embarqué) :
 * il ne correspond à aucune signature autorisée.
 */

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo par fichier
export const MAX_FILES_PER_REQUEST = 5;

type FileKind = "image" | "pdf";

function detectFileKind(buf: Buffer): FileKind | null {
  // JPEG : FF D8 FF
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image";
  }
  // PNG : 89 50 4E 47
  if (
    buf.length >= 4 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
  ) {
    return "image";
  }
  // GIF : 47 49 46 38 ("GIF8")
  if (
    buf.length >= 4 &&
    buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38
  ) {
    return "image";
  }
  // WEBP : 52 49 46 46 .... 57 45 42 50 ("RIFF....WEBP")
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) {
    return "image";
  }
  // PDF : 25 50 44 46 ("%PDF")
  if (
    buf.length >= 4 &&
    buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46
  ) {
    return "pdf";
  }
  return null;
}

/**
 * Valide la liste de fichiers d'une requête d'upload.
 * Retourne `null` si tout est valide, sinon un message d'erreur
 * en français à renvoyer en 400.
 */
export async function validateUploadedFiles(
  files: File[],
  { allowPdf = false }: { allowPdf?: boolean } = {}
): Promise<string | null> {
  if (!files || files.length === 0) {
    return "Aucun fichier reçu";
  }
  if (files.length > MAX_FILES_PER_REQUEST) {
    return `Trop de fichiers : ${files.length} reçus (maximum ${MAX_FILES_PER_REQUEST} par envoi)`;
  }

  const accepted = allowPdf
    ? "JPEG, PNG, WEBP, GIF ou PDF"
    : "JPEG, PNG, WEBP ou GIF";

  for (const file of files) {
    if (file.size === 0) {
      return `Fichier vide : ${file.name}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `Fichier trop grand : ${file.name} (maximum 10 Mo)`;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const kind = detectFileKind(buffer);

    if (!kind) {
      return `Type de fichier non autorisé : ${file.name}. Formats acceptés : ${accepted}.`;
    }
    if (kind === "pdf" && !allowPdf) {
      return `Les PDF ne sont pas acceptés ici : ${file.name}. Utilisez la section Khotba pour envoyer un PDF.`;
    }
  }

  return null;
}
