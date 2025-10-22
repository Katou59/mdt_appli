"use client";

import Page from "@/components/Page";
import UserUpdate from "@/components/UserUpdate";
import axiosClient, { getData } from "@/lib/axiosClient";
import { useAlert } from "@/lib/Contexts/AlertContext";
import { useUser } from "@/lib/Contexts/UserContext";
import User from "@/types/class/User";
import { UserToUpdateType, UserType } from "@/types/db/user";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function UpdateMeClient() {
    const { user: currentUser, setUser: setCurrentUser } = useUser();
    const router = useRouter();
    const { setAlert } = useAlert();

    async function onSubmit(updatedUser: UserToUpdateType): Promise<void> {
        const userResponse = await getData(
            axiosClient.put(`/users/${currentUser!.id}`, updatedUser)
        );
        if (userResponse.errorMessage) {
            setAlert({ title: "Erreur", description: userResponse.errorMessage });
            return Promise.reject();
        }

        const resultUser = new User(userResponse.data as UserType);
        setCurrentUser(resultUser);
        toast.success("Utilisateur mis à jour avec succès");
        router.push(`/police/users/me`);
        return Promise.resolve();
    }

    function onCancel() {
        router.push(`/police/users/me`);
    }

    return (
        <Page title="Modifier mon profil">
            <UserUpdate
                userToUpdate={currentUser!.toType()}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </Page>
    );
}
