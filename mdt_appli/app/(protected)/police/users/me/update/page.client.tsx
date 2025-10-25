"use client";

import Page from "@/components/page";
import UserUpdate from "@/components/user-update";
import axiosClient, { getData } from "@/lib/axios-client";
import { useAlert } from "@/lib/Contexts/alert-context";
import { useUser } from "@/lib/Contexts/user-context";
import User from "@/types/class/User";
import { UserToUpdateType, UserType } from "@/types/db/user";
import { useRouter } from "next/navigation";
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
