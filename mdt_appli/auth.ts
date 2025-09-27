import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Discord],
    callbacks: {
        async jwt({ token, profile, account }) {
            if (profile?.id) token.discordId = profile.id;
            if (account?.providerAccountId) token.discordId = account.providerAccountId;
            return token;
        },
        async session({ session, token }) {
            if (token.discordId) (session.user as any).discordId = token.discordId as string;
            return session;
        },
    },
});
