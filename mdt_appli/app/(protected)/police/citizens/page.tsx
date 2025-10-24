import { auth } from "@/auth";
import Alert from "@/components/Alert";
import CitizenService from "@/services/citizenService";
import CitizensClient from "./page.client";

export const metadata = {
    title: "MDT - Liste des citoyens",
    description: "Liste et gestion des citoyens.",
};

export default async function Citizens() {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return <Alert type="unauthorized" />;
        }

        const citizenService = await CitizenService.create(session.user.discordId);
        const pager = await citizenService.getList(1, 20, null);
        return <CitizensClient pager={pager.toType()} />;
    } catch {
        return <Alert />;
    }
}
