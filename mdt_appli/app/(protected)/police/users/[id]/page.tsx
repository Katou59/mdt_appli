import UserIdClient from "./page.client";
import { UserRepository } from "@/repositories/userRepository";
import Alert from "@/components/Alert";

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
        const userId = (await params)?.id;
        if (!userId) {
            return <Alert descrition="Paramètre invalide" />;
        }

        const user = await UserRepository.Get(userId);
        if (!user) {
            return <Alert descrition="Paramètre invalide" />;
        }

        return <UserIdClient user={user.toType()} />;
    } catch {
        return <Alert />;
    }
}
