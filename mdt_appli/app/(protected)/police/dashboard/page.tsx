import { auth } from "@/auth";
import Alert from "@/components/alert";
import StatService from "@/services/stat-service";
import { StatType } from "@/types/response/stat-type";
import { DashboardCard } from "./dashboard-card";

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
            <DashboardCard
                title="Agents"
                count={stats.user.count}
                countToday={stats.user.countToday}
            />
            <DashboardCard
                title="Citoyens"
                count={stats.citizen.count}
                countToday={stats.citizen.countToday}
            />
            <DashboardCard title="Amendes" count={stats.citizenFineCount} countToday={0} />
        </div>
    );
}
