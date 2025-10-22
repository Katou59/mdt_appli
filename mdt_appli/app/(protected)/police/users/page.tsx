import React from "react";
import UsersClient from "./page.client";
import { createAxiosServer } from "@/lib/axiosServer";
import { MetadataType } from "@/types/utils/metadata";
import { UserRepository } from "@/repositories/userRepository";
import { auth } from "@/auth";

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

        const currentUser = await UserRepository.Get(session.user.discordId);
        if (!currentUser?.isAdmin) {
            return <UsersClient error="Vous n'êtes pas autorisé" />;
        }

        const axios = await createAxiosServer();
        const response = await axios.get("/metadata");
        const metadata = response.data as MetadataType;

        const users = await UserRepository.GetList({
            itemPerPage: 20,
            page: 1,
        });

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
