import { auth } from "@/auth";
import Alert from "@/components/alert";
import MetadataService from "@/services/metadata-service";
import UserService from "@/services/user-service";
import AddUserClient from "./page.client";

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
        const currentUser = userService.currentUser;
        if (!currentUser?.isAdmin) {
            return <Alert type="unauthorized" />;
        }

        const metadataService = new MetadataService(currentUser);
        const metadata = await metadataService.get();

        return <AddUserClient metadata={metadata} />;
    } catch {
        return <Alert />;
    }
}
