import { auth } from "@/auth";
import Alert from "@/components/alert";
import CitizenService from "@/services/citizen-service";
import MetadataService from "@/services/metadata-service";
import UpdateCitizenClient from "./page.client";

export const metadata = {
    title: "MDT - Modifier un citoyen",
    description: "Modification d'un citoyen.",
};

export default async function UpdateCitizen({ params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return <Alert type="unauthorized" />;
        }

        const citizenService = await CitizenService.create(session.user.discordId);
        const metadataService = new MetadataService(citizenService.currentUser);

        const [citizen, metadata] = await Promise.all([
            await citizenService.get((await params).id),
            await metadataService.get(),
        ]);

        return <UpdateCitizenClient citizen={citizen.toType()} metadata={metadata} />;
    } catch {
        return <Alert />;
    }
}
