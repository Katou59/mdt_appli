import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";
import { Account, Profile } from "@auth/core/types";

export const authOptions = {
    providers: [DiscordProvider],
    callbacks: {
        async jwt({ token, profile, account }: { token: JWT; profile?: Profile; account?: Account }) {
            if (profile?.id) token.discordId = profile.id;
            if (account?.providerAccountId) token.discordId = account.providerAccountId;
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token.discordId) {
                (session.user as User & { discordId?: string }).discordId = token.discordId as string;
            }
            return session;
        },
    },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);