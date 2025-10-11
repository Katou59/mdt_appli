import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            discordId?: string;
        } & DefaultSession['user'];
    }

    interface User {
        discordId?: string;
    }

    interface JWT {
        discordId?: string;
    }
}
