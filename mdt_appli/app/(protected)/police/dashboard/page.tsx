import { auth } from "@/auth";
import Alert from "@/components/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatService from "@/services/stat-service";
import { StatType } from "@/types/response/stat-type";
import { IconEqual, IconTrendingUp } from "@tabler/icons-react";

export const metadata = {
    title: "MDT - Accueil",
    description: "Accueil du MDT.",
};

export default async function Dashboard() {
    let stats: StatType | null = null;

    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return <Alert type="unauthorized" />;
        }

        const statService = await StatService.create(session.user.discordId);
        if (!statService.currentUser.rank?.job?.id) return <Alert />;

        const stat = await statService.get(statService.currentUser.rank.job.id);
        stats = stat;
    } catch {
        return <Alert />;
    }
    return (
        <div className="grid grid-cols-3 gap-5 mt-5">
            <CardCustom
                title="Agents"
                count={stats.user.count}
                countToday={stats.user.countToday}
            />
            <CardCustom
                title="Citoyens"
                count={stats.citizen.count}
                countToday={stats.citizen.countToday}
            />
            <CardCustom title="Amendes" count={stats.citizenFineCount} countToday={0} />
        </div>
    );
}

function CardCustom({
    title,
    count,
    countToday,
}: {
    title: string;
    count: number;
    countToday: number;
}) {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {count}
                </CardTitle>
                <CardAction>
                    {countToday > 0 ? (
                        <Badge variant="outline" className="text-success">
                            <IconTrendingUp />+ {countToday}
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="text-error">
                            <IconEqual /> {countToday}
                        </Badge>
                    )}
                </CardAction>
            </CardHeader>
        </Card>
    );
}
