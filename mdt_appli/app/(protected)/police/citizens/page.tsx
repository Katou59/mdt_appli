import CitizenRepository from "@/repositories/citizenRepository";
import CitizensClient from "./page.client";
import Alert from "@/components/Alert";

export const metadata = {
    title: "MDT - Liste des citoyens",
    description: "Liste et gestion des citoyens.",
};

export default async function Citizens() {
    try {
        const pager = await CitizenRepository.GetList(1, 20);
        return <CitizensClient pager={pager.toType()} />;
    } catch {
        return <Alert />;
    }
}
