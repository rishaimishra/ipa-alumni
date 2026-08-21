import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyOtp } from "@/lib/otp";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      id: "otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Code", type: "text" },
      },
      authorize: async (credentials) => {
        const phone = credentials?.phone;
        const code = credentials?.code;
        if (typeof phone !== "string" || typeof code !== "string") return null;

        const ok = await verifyOtp(phone, code);
        if (!ok) return null;

        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user || user.status === "SUSPENDED") return null;

        if (user.status === "PENDING_VERIFICATION") {
          await prisma.user.update({
            where: { id: user.id },
            data: { status: "ACTIVE", phoneVerifiedAt: new Date() },
          });
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "admin-credentials",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;
        if (user.role !== "ADMIN" && user.role !== "MODERATOR") return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.uid = user.id!;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.uid as string;
      session.user.role = token.role as typeof session.user.role;
      return session;
    },
  },
});
