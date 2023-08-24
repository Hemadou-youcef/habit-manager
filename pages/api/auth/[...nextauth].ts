import NextAuth, { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";


const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "username" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) {
                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials.username,
                    },
                });

                console.log(user)

                if (!user) {
                    throw new Error("No user found");
                }

                if (user?.password) {
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }
                    return user;
                }
                return null;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
        maxAge: 60 * 60 * 24 * 30,
    },
    callbacks: {
        async session({ session, token, user }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    image: session?.user?.image || "/images/default-profile.png",
                }
            };
        }
    },
    pages: {
        signIn: "/auth/signIn",
        error: "/auth/signIn",
    },
    debug: process.env.NODE_ENV === "development",
}

export default NextAuth(authOptions); 