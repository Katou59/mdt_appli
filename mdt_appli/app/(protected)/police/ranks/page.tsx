import { auth } from "@/auth";
import Alert from "@/components/Alert";
import RanksClient from "./page.client";
import UserService from "@/services/userService";

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

        const userService = await UserService.create(session.user.discordId);
        const currentUser = await userService.get(session.user.discordId);
        if (!currentUser?.isAdmin) {
            return <Alert type="unauthorized" />;
        }

        return <RanksClient />;
    } catch {
        return <Alert />;
    }
}
