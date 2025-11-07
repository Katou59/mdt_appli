import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconEqual, IconTrendingUp } from "@tabler/icons-react";

type Props = {
    title: string;
    count: number;
    countToday: number;
};

export function DashboardCard({ title, count, countToday }: Props) {
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
