// Run once: node update-contact-db.mjs
// Updates address and email in the database
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const addr = "97 Rue St-Jean-Baptiste Est\nMontmagny, QC G5V 1J9, Canada";
const mail = "Montmagny.ccim@gmail.com";

async function main() {
  // SiteMode
  await prisma.siteMode.upsert({
    where:  { id: "singleton" },
    update: { address: addr, email: mail },
    create: { id: "singleton", address: addr, email: mail, mode: "normal", invocationsActive: true },
  });

  // site_settings content
  for (const [title, body, order] of [["address", addr, 0], ["email", mail, 1]]) {
    const ex = await prisma.content.findFirst({ where: { section: "site_settings", title } });
    if (ex) await prisma.content.update({ where: { id: ex.id }, data: { body } });
    else    await prisma.content.create({ data: { section: "site_settings", title, body, order } });
    console.log(`✓ site_settings.${title} = ${body.split("\n")[0]}`);
  }

  await prisma.$disconnect();
  console.log("Done ✓");
}
main().catch((e) => { console.error(e); process.exit(1); });
