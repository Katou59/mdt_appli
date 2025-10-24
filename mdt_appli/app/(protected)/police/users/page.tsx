import { auth } from "@/auth";
import { createAxiosServer } from "@/lib/axios-server";
import UserService from "@/services/user-service";
import { MetadataType } from "@/types/utils/metadata";
import UsersClient from "./page.client";

export const metadata = {
    title: "MDT - Liste des utilisateurs",
    description: "Liste et gestion des utilisateurs.",
};

export default async function Users() {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return <UsersClient error="Vous n'êtes pas autorisé" />;
        }

        const userService = await UserService.create(session.user.discordId);
        const currentUser = await userService.get(session.user.discordId);
        if (!currentUser?.isAdmin) {
            return <UsersClient error="Vous n'êtes pas autorisé" />;
        }

        const axios = await createAxiosServer();
        const response = await axios.get("/metadata");
        const metadata = response.data as MetadataType;

        const users = await userService.getList(1, 20);

        return (
            <UsersClient
                metadata={metadata}
                pager={{
                    itemCount: users.itemCount,
                    itemPerPage: users.itemPerPage,
                    items: users.items.map((x) => x.toType()),
                    page: users.page,
                    pageCount: users.pageCount,
                }}
            />
        );
    } catch {
        return <UsersClient />;
    }
}
