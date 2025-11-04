import { auth } from "@/auth";
import Alert from "@/components/alert";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatService from "@/services/stat-service";

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

        const statService = await StatService.create(session.user.discordId);
        if (!statService.currentUser.rank?.job?.id) return <Alert />;

        const stat = await statService.get(statService.currentUser.rank.job.id);

        userCount = stat.userCount;
        citizenCount = stat.citizenCount;
        citizenFineCount = stat.citizenFineCount;
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
