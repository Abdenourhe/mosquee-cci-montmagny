import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/auth";

// ── Rate limiting en mémoire ─────────────────────────────────
// Map module-level : IP → timestamps des envois (fenêtre glissante).
// Limite : 5 messages par IP par heure.
// NOTE : en serverless, chaque instance possède sa propre mémoire —
// protection raisonnable pour ce site, mais pour du multi-instance
// strict il faudrait un store partagé (ex. Upstash Redis).
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 heure
const rateLimitHits = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateLimitHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimitHits.set(ip, recent);
  // Nettoyage opportuniste pour éviter une croissance mémoire illimitée
  if (rateLimitHits.size > 1000) {
    for (const [key, times] of rateLimitHits) {
      const alive = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (alive.length === 0) rateLimitHits.delete(key);
      else rateLimitHits.set(key, alive);
    }
  }
  return false;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot : le champ "website" est invisible pour les humains.
    // S'il est rempli, c'est un bot → rejet silencieux (fausse réponse
    // de succès pour ne pas signaler la détection), rien n'est enregistré.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const { name, email, phone, message } = body;

    // ── Validation serveur ──
    if (typeof name !== "string" || !name.trim() || name.length > 100) {
      return NextResponse.json({ error: "Nom requis (100 caractères maximum)" }, { status: 400 });
    }
    if (typeof email !== "string" || !email.trim() || email.length > 200 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
    }
    if (phone !== undefined && phone !== null && phone !== "" && (typeof phone !== "string" || phone.length > 30)) {
      return NextResponse.json({ error: "Numéro de téléphone invalide (30 caractères maximum)" }, { status: 400 });
    }
    if (typeof message !== "string" || !message.trim() || message.length > 2000) {
      return NextResponse.json({ error: "Message requis (2000 caractères maximum)" }, { status: 400 });
    }

    // ── Rate limiting ──
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Trop de messages envoyés. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    const contact = await prisma.contactMessage.create({
      data: { name: name.trim(), email: email.trim(), phone: phone?.trim() || null, message: message.trim() },
    });

    return NextResponse.json({ success: true, id: contact.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
