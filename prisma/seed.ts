import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@ccimontmagny.ca";

async function main() {
  console.log("🌱 Démarrage du seed...");

  // Le mot de passe initial de l'admin DOIT venir de l'environnement.
  const seedPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!seedPassword) {
    throw new Error(
      "❌ SEED_ADMIN_PASSWORD n'est pas défini.\n" +
        "   Ajoutez SEED_ADMIN_PASSWORD=<mot-de-passe-initial> dans votre fichier .env,\n" +
        "   puis relancez le seed. Aucun mot de passe par défaut n'est utilisé."
    );
  }

  // Admin principal — idempotent : si l'admin existe déjà, on ne touche
  // PAS à son mot de passe (il a pu être changé en production).
  const hashedPassword = await bcrypt.hash(seedPassword, 12);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: { email: ADMIN_EMAIL, password: hashedPassword, name: "Administrateur CCI", role: "ADMIN" },
  });
  console.log("✅ Admin vérifié (créé seulement s'il était absent)");

  // Mode site — upsert sur la clé primaire "singleton"
  await prisma.siteMode.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", mode: "normal" },
  });
  console.log("✅ Mode site vérifié");

  // Activités de base — pas de contrainte unique en base :
  // on crée seulement si aucune activité ne porte déjà ce titre.
  const activities = [
    { icon: "📖", title: "Cours de Coran",           desc: "Récitation, tajwid et mémorisation pour enfants et adultes. Classes séparées par niveaux dans une ambiance bienveillante.", schedule: "Sam & Dim",     tag: "Éducation",  colorKey: "green",   order: 1 },
    { icon: "⚽", title: "Activités Jeunesse",        desc: "Sports collectifs, ateliers créatifs, sorties culturelles et camps islamiques d'été pour les 8–17 ans.",                schedule: "Chaque semaine", tag: "Jeunesse",   colorKey: "gold",    order: 2 },
    { icon: "🎤", title: "Conférences",               desc: "Séminaires mensuels animés par des savants reconnus sur des thèmes religieux, sociaux et culturels.",                  schedule: "1× par mois",   tag: "Savoir",     colorKey: "purple",  order: 3 },
    { icon: "🌙", title: "Événements Communautaires", desc: "Aïd el-Fitr, Aïd el-Adha, iftars collectifs, collectes alimentaires et actions solidaires tout au long de l'année.",  schedule: "Toute l'année", tag: "Communauté", colorKey: "emerald", order: 4 },
  ];
  let createdActivities = 0;
  for (const a of activities) {
    const existing = await prisma.activity.findFirst({ where: { title: a.title } });
    if (!existing) {
      await prisma.activity.create({ data: a });
      createdActivities++;
    }
  }
  console.log(`✅ Activités : ${createdActivities} créée(s), ${activities.length - createdActivities} déjà présente(s)`);

  // Contenus — clé naturelle : couple (section, title), création seulement si absent.
  const contents = [
    { section: "hero",  title: "CCI DE MONTMAGNY", body: "Un lieu de foi, de partage et de communauté au cœur du Québec", order: 1 },
    { section: "about", title: "À propos de la CCI Montmagny", body: "La CCI de Montmagny est un lieu de rassemblement pour la communauté musulmane de Montmagny et des régions avoisinantes au Québec, Canada.", order: 1 },
  ];
  let createdContents = 0;
  for (const c of contents) {
    const existing = await prisma.content.findFirst({
      where: { section: c.section, title: c.title },
    });
    if (!existing) {
      await prisma.content.create({ data: c });
      createdContents++;
    }
  }
  console.log(`✅ Contenus : ${createdContents} créé(s), ${contents.length - createdContents} déjà présent(s)`);

  console.log("🎉 Seed terminé (idempotent — aucune donnée existante supprimée) !");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
