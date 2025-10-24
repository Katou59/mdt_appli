import UserIdClient from "./page.client";
import Alert from "@/components/Alert";
import UserService from "@/services/userService";
import { auth } from "@/auth";

export const metadata = {
    title: "MDT - Consulter un utilisateur",
    description: "Consultation et gestion d'un utilisateur.",
};

type Props = {
    params: {
        id: string;
    };
};

export default async function UserId({ params }: Props) {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return <Alert type="unauthorized" />;
        }

        const userId = (await params)?.id;
        if (!userId) {
            return <Alert descrition="Paramètre invalide" />;
        }

        const userService = await UserService.create(session.user.discordId);
        const user = await userService.get(userId);
        if (!user) {
            return <Alert descrition="Paramètre invalide" />;
        }

        return <UserIdClient user={user.toType()} />;
    } catch {
        return <Alert />;
    }
}
