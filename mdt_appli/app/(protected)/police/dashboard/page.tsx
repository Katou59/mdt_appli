import { auth } from "@/auth";
import Alert from "@/components/alert";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetadataService from "@/services/metadata-service";

export const metadata = {
    title: "MDT - Accueil",
    description: "Accueil du MDT.",
};

export default async function Dashboard() {
    let userCount = 0;
    let citizenCount = 0;
    let citizenFineCount = 0;

    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return <Alert type="unauthorized" />;
        }
        const metadataService = await MetadataService.create(session.user.discordId);
        const metadata = await metadataService.get();
        userCount = metadata.userCount;
        citizenCount = metadata.citizenCount;
        citizenFineCount = metadata.citizenFineCount;
    } catch {
        return <Alert />;
    }
    return (
        <div className="grid grid-cols-3 gap-5 mt-5">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Agents</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {userCount}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Citoyens</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {citizenCount}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Amendes</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {citizenFineCount}
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}
