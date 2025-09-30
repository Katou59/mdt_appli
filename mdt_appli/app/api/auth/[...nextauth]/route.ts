import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import {UserRepository} from "@/repositories/userRepository";

const auth = NextAuth({
    providers: [Discord],
    callbacks: {
        async signIn({user, profile}) {
            if (!profile?.id) return false;
            
            const userDb = await UserRepository.get(profile.id);
            
            if(!userDb || userDb.isDisable) return false;

            if(!userDb.email || !userDb.name || userDb.firstLogin){
                userDb.email = user.email!;
                userDb.name = user.name!;
                userDb.firstLogin = new Date();
            }

            userDb.lastLogin = new Date();

            await UserRepository.update({
                id: userDb.id,
                email: userDb.email,
                name: userDb.name!,
                firstLogin: userDb.firstLogin!,
                lastLogin: userDb.lastLogin
            });

            return true;
        },
        async jwt({token, profile, account}) {
            if (profile?.id) {
                token.discordId = profile.id;
            }
            if (account?.providerAccountId) {
                token.discordId = account.providerAccountId;
            }
            return token;
        },
        async session({session, token}) {
            session.user.discordId = token.discordId as string;
            return session;
        },
    },
    pages: {
        error: "/"
    }
});

export const {GET, POST} = auth.handlers;