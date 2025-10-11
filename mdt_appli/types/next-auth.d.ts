declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            discordId?: string;
        };
    }

    interface User {
        discordId?: string;
    }

    interface JWT {
        discordId?: string;
    }
}
