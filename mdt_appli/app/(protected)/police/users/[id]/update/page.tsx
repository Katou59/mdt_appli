import { auth } from "@/auth";
import Alert from "@/components/Alert";
import UpdateUserClient from "./page.client";
import { createAxiosServer } from "@/lib/axiosServer";
import { MetadataType } from "@/types/utils/metadata";
import UserService from "@/services/userService";

export const metadata = {
    title: "MDT - Modifier un utilisateur",
    description: "Modification et gestion d'un utilisateur.",
};

type Props = {
    params: {
        id: string;
    };
};

export default async function UpdateUser({ params }: Props) {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return <Alert type="unauthorized" />;
        }

        const userId = (await params)?.id;
        if (!userId) {
            return <Alert type="invalidParameter" />;
        }

        const userService = await UserService.create(session.user.discordId);
        const user = await userService.get(userId);
        if (!user) {
            return <Alert type="invalidParameter" />;
        }

        const currentUser = await userService.get(session?.user.discordId);
        if (!currentUser?.isAdmin && userId !== currentUser?.id) {
            return <Alert type="unauthorized" />;
        }

        const axios = await createAxiosServer();
        const response = await axios.get("/metadata");
        const metadata = response.data as MetadataType;

        return <UpdateUserClient metadata={metadata} user={user.toType()} />;
    } catch {
        return <Alert />;
    }
}
