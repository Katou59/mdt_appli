import {usersTable} from "@/db/schema";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import {drizzle} from "drizzle-orm/node-postgres";
import {eq} from "drizzle-orm";
import {timestamp} from "drizzle-orm/pg-core/columns/timestamp";
import {UserRepository} from "@/repositories/userRepositories";

const db = drizzle(process.env.DATABASE_URL!);

const auth = NextAuth({
    providers: [Discord],
    callbacks: {
        async signIn({user, profile}) {
            if (!profile?.id) return false;
            
            const userDb = await UserRepository.get(profile.id);

            if(!userDb) return false;

            if(!userDb.email || !userDb.email){
                userDb.email = user.email!;
                userDb.name = user.name!;
                userDb.firstLogin = new Date();
            }

            userDb.lastLogin = new Date();

            await db.update(usersTable).set(userDb);

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
            console.log('session:', session);
            return session;
        },
    },
    pages: {
        error: "/"
    }
});

export const {GET, POST} = auth.handlers;