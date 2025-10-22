import { auth } from "@/auth";
import Alert from "@/components/Alert";
import { UserRepository } from "@/repositories/userRepository";
import UpdateUserClient from "./page.client";
import { createAxiosServer } from "@/lib/axiosServer";
import { MetadataType } from "@/types/utils/metadata";

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
        const userId = (await params)?.id;
        if (!userId) {
            return <Alert type="invalidParameter" />;
        }

        const user = await UserRepository.Get(userId);
        if (!user) {
            return <Alert type="invalidParameter" />;
        }

        const session = await auth();
        if (!session?.user?.discordId) {
            return <Alert type="invalidParameter" />;
        }

        const currentUser = await UserRepository.Get(session?.user.discordId);
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
