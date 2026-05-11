import { prisma } from "@/lib/db";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PrayerTimes from "@/components/PrayerTimes";
import Announcements from "@/components/Announcements";
import About from "@/components/About";
import Activities from "@/components/Activities";
import SocialMedia from "@/components/SocialMedia";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SiteModeBanner from "@/components/SiteModeBanner";
import SideInvocations from "@/components/SideInvocations";
import SectionWrapper from "@/components/SectionWrapper";
import DonSection from "@/components/DonSection";
import KhotbaSection from "@/components/KhotbaSection";
import SectionTitle from "@/components/SectionTitle";
import SectionDivider from "@/components/SectionDivider";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settingsRows, aboutRows, cardRows] = await Promise.all([
    prisma.content.findMany({ where: { section: "site_settings" } }).catch(() => []),
    prisma.content.findMany({ where: { section: "about" }, orderBy: { order: "asc" } }).catch(() => []),
    prisma.content.findMany({ where: { section: "about_card" }, orderBy: { order: "asc" } }).catch(() => []),
  ]);

  const getSetting = (title: string, fallback: string) =>
    settingsRows.find((r) => r.title === title)?.body ?? fallback;

  const siteAddress = getSetting("address", "97 Rue St-Jean-Baptiste Est\nMontmagny, QC G5V 1J9, Canada");
  const siteEmail   = getSetting("email",   "Montmagny.ccim@gmail.com");

  return (
    <>
      <SiteModeBanner />
      <SideInvocations />
      <Header />

      <main>
        <Hero />
        <SectionDivider variant="wave" height={100} />

        <SectionWrapper id="horaires" alt>
          <SectionTitle title="Horaires des Prières" subtitle="Les cinq prières quotidiennes et la prière du vendredi"
            label="Temps de Prière" labelIcon="🕐" labelVariant="gradient" />
          <PrayerTimes />
          <KhotbaSection />
        </SectionWrapper>

        <SectionDivider variant="islamic" />

        <SectionWrapper id="annonces">
          <SectionTitle title="Annonces" subtitle="Restez informés des actualités de la communauté"
            label="Actualités" labelIcon="📢" labelVariant="dark" />
          <Announcements />
        </SectionWrapper>

        <SectionDivider variant="line" />

        <SectionWrapper id="apropos" alt>
          <SectionTitle title="À Propos" subtitle="Notre histoire, notre mission, nos valeurs"
            label="Qui sommes-nous" labelIcon="🕌" labelVariant="gradient" />
          <About paragraphs={aboutRows} cards={cardRows} />
        </SectionWrapper>

        <SectionDivider variant="wave" flip height={100} />

        <SectionWrapper id="activites">
          <SectionTitle title="Activités" subtitle="Cours de Coran, événements communautaires et plus"
            label="Programmes" labelIcon="📚" labelVariant="dark" />
          <Activities />
        </SectionWrapper>

        <SectionDivider variant="dots" />

        <SectionWrapper id="don" alt>
          <SectionTitle title="Soutenir la Mosquée" subtitle="Participez à l'essor de votre communauté"
            label="Dons" labelIcon="💰" labelVariant="gradient" />
          <DonSection />
        </SectionWrapper>

        <SectionDivider variant="line" />

        <SectionWrapper id="social">
          <SectionTitle title="Suivez-nous" subtitle="Rejoignez notre communauté en ligne"
            label="Communauté" labelIcon="🌐" labelVariant="gradient" />
          <SocialMedia />
        </SectionWrapper>

        <SectionDivider variant="line" />

        <SectionWrapper id="contact">
          <SectionTitle title="Contact" subtitle="Une question ? Contactez-nous"
            label="Nous joindre" labelIcon="📧" labelVariant="dark" />
          <Contact address={siteAddress} email={siteEmail} />
        </SectionWrapper>
      </main>

      <Footer address={siteAddress} email={siteEmail} />
    </>
  );
}
