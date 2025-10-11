import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import type { NextAuthConfig, User } from "next-auth";

export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile, user }) {
            // Premier login
            if (account && user) {
                token.discordId = account.providerAccountId;
            }

            // Si le profil existe (nouvelle structure)
            if (profile?.id) {
                token.discordId = profile.id;
            }

            return token;
        },
        async session({ session, token }) {
            if (token.discordId) {
                (session.user as User & { discordId?: string }).discordId =
                    token.discordId as string;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
