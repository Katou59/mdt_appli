import { auth } from "@/auth";
import Alert from "@/components/alert";
import CitizenService from "@/services/citizen-service";
import CitizenIdClient from "./page.client";

export const metadata = {
    title: "MDT - Consulter un citoyen",
    description: "Consultation d'un citoyen.",
};

export default async function CitizenId({ params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return <Alert type="unauthorized" />;
        }

        const citizenService = await CitizenService.create(session.user.discordId);
        const citizen = await citizenService.get((await params).id);

        return <CitizenIdClient citizen={citizen.toType()} />;
    } catch {
        return <Alert />;
    }
}
