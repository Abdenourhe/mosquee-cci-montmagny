import { NextAuthOptions, Session, getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) throw new Error("Identifiants invalides");
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Identifiants invalides");
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Vérifie que la requête provient d'un administrateur authentifié.
 * Retourne la session si c'est le cas, sinon `null`.
 */
export async function requireAdmin(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  if (session.user.role && session.user.role !== "ADMIN") return null;
  return session;
}

/** Réponse 401 standard pour les handlers d'API protégés. */
export function unauthorized() {
  return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}
