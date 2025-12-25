
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          return null;
        }

        if (user.isBanned) {
          throw new Error(`Your account has been banned. Reason: ${user.banReason || "Violation of platform terms."}`);
        }

        return { 
          id: user._id.toString(), 
          email: user.email, 
          name: user.name, 
          role: user.role,
          isVerified: user.isVerified,
          requiresPasswordReset: user.requiresPasswordReset || false 
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_dev_secret_key_123",
  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // Redirect to login on error
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.requiresPasswordReset = user.requiresPasswordReset;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isVerified = token.isVerified;
        session.user.requiresPasswordReset = token.requiresPasswordReset;
      }
      return session;
    },
  },
};
