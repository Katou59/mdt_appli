import { auth } from "@/auth";
import Alert from "@/components/Alert";
import { UserRepository } from "@/repositories/userRepository";
import RanksClient from "./page.client";

export const metadata = {
    title: "MDT - Gestion des grades",
    description: "Gestion des grades.",
};


export default async function Ranks() {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return <Alert type="unauthorized" />;
        }

        const currentUser = await UserRepository.Get(session.user.discordId);
        if (!currentUser?.isAdmin) {
            return <Alert type="unauthorized" />;
        }

        return <RanksClient />;
    } catch {
        return <Alert />;
    }
}
