import { Auth, type AuthConfig } from "@auth/core";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import type { JWT } from "@auth/core/jwt";
import type { Session } from "@auth/core/types";

const prisma = new PrismaClient();

export interface CustomSessionUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
}

export interface CustomSession extends Session {
  user: CustomSessionUser;
}

export const authConfig: AuthConfig = {
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    },
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as JWT & { id?: string; role?: string }).role = (user as any).role;
        (token as JWT & { id?: string; role?: string }).id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as CustomSessionUser).id = (token as JWT & { id?: string }).id as string;
        (session.user as unknown as CustomSessionUser).role = (token as JWT & { role?: string }).role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  // La ruta del handler está montada en /api/auth/[...nextauth];
  // por defecto @auth/core usa "/auth" y no lograría parsear las acciones.
  basePath: "/api/auth",
};

export async function handleAuth(request: Request) {
  return Auth(request, authConfig);
}
