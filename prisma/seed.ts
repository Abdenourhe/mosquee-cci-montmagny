import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seed...");

  await prisma.activityPhoto.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.siteMode.deleteMany();
  await prisma.content.deleteMany();
  await prisma.user.deleteMany();

  // Admin principal
  const hashedPassword = await bcrypt.hash("Admin@2024!", 12);
  await prisma.user.upsert({
    where: { email: "admin@ccimontmagny.ca" },
    update: {},
    create: { email: "admin@ccimontmagny.ca", password: hashedPassword, name: "Administrateur CCI", role: "ADMIN" },
  });
  console.log("✅ Admin créé");

  // Mode site
  await prisma.siteMode.create({ data: { id: "singleton", mode: "normal" } });

  // Activités de base
  const activities = [
    { icon: "📖", title: "Cours de Coran",           desc: "Récitation, tajwid et mémorisation pour enfants et adultes. Classes séparées par niveaux dans une ambiance bienveillante.", schedule: "Sam & Dim",     tag: "Éducation",  colorKey: "green",   order: 1 },
    { icon: "⚽", title: "Activités Jeunesse",        desc: "Sports collectifs, ateliers créatifs, sorties culturelles et camps islamiques d'été pour les 8–17 ans.",                schedule: "Chaque semaine", tag: "Jeunesse",   colorKey: "gold",    order: 2 },
    { icon: "🎤", title: "Conférences",               desc: "Séminaires mensuels animés par des savants reconnus sur des thèmes religieux, sociaux et culturels.",                  schedule: "1× par mois",   tag: "Savoir",     colorKey: "purple",  order: 3 },
    { icon: "🌙", title: "Événements Communautaires", desc: "Aïd el-Fitr, Aïd el-Adha, iftars collectifs, collectes alimentaires et actions solidaires tout au long de l'année.",  schedule: "Toute l'année", tag: "Communauté", colorKey: "emerald", order: 4 },
  ];
  for (const a of activities) await prisma.activity.create({ data: a });
  console.log(`✅ ${activities.length} activités créées`);

  // Contenus
  await prisma.content.createMany({ data: [
    { section: "hero",  title: "CCI DE MONTMAGNY", body: "Un lieu de foi, de partage et de communauté au cœur du Québec", order: 1 },
    { section: "about", title: "À propos de la CCI Montmagny", body: "La CCI de Montmagny est un lieu de rassemblement pour la communauté musulmane de Montmagny et des régions avoisinantes au Québec, Canada.", order: 1 },
  ]});

  console.log("🎉 Seed terminé !");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
