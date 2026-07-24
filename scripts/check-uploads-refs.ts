/**
 * Script EN LECTURE SEULE : cherche dans les colonnes URL de la base
 * toute valeur contenant "/uploads/" (références potentielles vers
 * public/uploads/). Aucune écriture en base.
 *
 * Usage : npx tsx scripts/check-uploads-refs.ts
 */
import { prisma } from "../src/lib/db";

async function main() {
  const matches: string[] = [];

  const activityPhotos = await prisma.activityPhoto.findMany({
    where: { url: { contains: "/uploads/" } },
    select: { id: true, url: true, activityId: true },
  });
  for (const p of activityPhotos) {
    matches.push(`ActivityPhoto id=${p.id} (activity ${p.activityId}) : ${p.url}`);
  }

  const announcementPhotos = await prisma.announcementPhoto.findMany({
    where: { url: { contains: "/uploads/" } },
    select: { id: true, url: true, announcementId: true },
  });
  for (const p of announcementPhotos) {
    matches.push(`AnnouncementPhoto id=${p.id} (announcement ${p.announcementId}) : ${p.url}`);
  }

  const contents = await prisma.content.findMany({
    where: { imageUrl: { contains: "/uploads/" } },
    select: { id: true, section: true, title: true, imageUrl: true },
  });
  for (const c of contents) {
    matches.push(`Content id=${c.id} (section ${c.section}, title ${c.title}) : ${c.imageUrl}`);
  }

  const socialLinks = await prisma.socialLink.findMany({
    where: { url: { contains: "/uploads/" } },
    select: { id: true, platform: true, url: true },
  });
  for (const s of socialLinks) {
    matches.push(`SocialLink id=${s.id} (${s.platform}) : ${s.url}`);
  }

  if (matches.length === 0) {
    console.log("✅ AUCUNE référence à /uploads/ trouvée en base. Suppression du dossier possible.");
  } else {
    console.log(`⚠️  ${matches.length} référence(s) à /uploads/ trouvée(s) en base :`);
    for (const m of matches) console.log("   - " + m);
    console.log("❌ NE PAS supprimer public/uploads/.");
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
