import UserService from "@/services/user-service";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

const auth = NextAuth({
    providers: [Discord],
    callbacks: {
        async signIn({ user, profile }) {
            if (!profile?.id) return false;

            const userService = await UserService.create(profile.id);
            const userDb = await userService.get(profile.id);

            if (!userDb || userDb.isDisable) return false;

            if (!userDb.email || !userDb.name || !userDb.firstLogin) {
                userDb.email = user.email!;
                userDb.name = user.name!;
                userDb.firstLogin = new Date();
            }

            await userService.update({
                id: userDb.id,
                email: userDb.email,
                name: userDb.name,
                lastLogin: new Date(),
            });

            return true;
        },
        async jwt({ token, profile, account }) {
            if (profile?.id) {
                token.discordId = profile.id;
            }
            if (account?.providerAccountId) {
                token.discordId = account.providerAccountId;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.discordId = token.discordId as string;
            return session;
        },
    },
    pages: {
        error: "/",
    },
});

export const { GET, POST } = auth.handlers;
