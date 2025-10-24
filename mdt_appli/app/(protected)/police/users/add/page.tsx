import { auth } from "@/auth";
import Alert from "@/components/Alert";
import { createAxiosServer } from "@/lib/axiosServer";
import { MetadataType } from "@/types/utils/metadata";
import AddUserClient from "./page.client";
import UserService from "@/services/userService";

export const metadata = {
    title: "MDT - Ajouter un utilisateur",
    description: "Ajout d'un utilisateur.",
};

export default async function AddUser() {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return <Alert type="invalidParameter" />;
        }

        const userService = await UserService.create(session.user.discordId);
        const currentUser = await userService.get(session?.user.discordId);
        if (!currentUser?.isAdmin) {
            return <Alert type="unauthorized" />;
        }

        const axios = await createAxiosServer();
        const response = await axios.get("/metadata");
        const metadata = response.data as MetadataType;

        return <AddUserClient metadata={metadata} />;
    } catch {
        return <Alert />;
    }
}
