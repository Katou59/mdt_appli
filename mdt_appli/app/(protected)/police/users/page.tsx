import React from "react";
import UsersClient from "./page.client";
import { createAxiosServer } from "@/lib/axiosServer";
import { MetadataType } from "@/types/utils/metadata";
import { UserRepository } from "@/repositories/userRepository";

export const metadata = {
    title: "MDT - Liste des utilisateurs",
    description: "Liste et gestion des utilisateurs.",
};

export default async function Users() {
    const axios = await createAxiosServer();
    const response = await axios.get("/metadata");
    const metadata = response.data as MetadataType;

    const pagerUsers = await UserRepository.GetList({
        itemPerPage: 20,
        page: 1,
    });

    return (
        <UsersClient
            metadata={metadata}
            pager={{
                itemCount: pagerUsers.itemCount,
                itemPerPage: pagerUsers.itemPerPage,
                items: pagerUsers.items.map((x) => x.toType()),
                page: pagerUsers.page,
                pageCount: pagerUsers.pageCount,
            }}
        />
    );
}
