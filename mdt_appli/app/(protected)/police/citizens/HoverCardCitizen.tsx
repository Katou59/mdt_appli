import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Citizen from "@/types/class/Citizen";
import dayjs from "dayjs";

type Props = {
    children: React.ReactNode;
    citizen: Citizen;
};

export function HoverCardCitizen({ children, citizen }: Props) {
    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardContent className="" side="right" align="start">
                <div className="flex flex-col justify-between items-center gap-4">
                    <Avatar className="w-15 h-15 rounded-full">
                        <AvatarImage src={citizen.photoUrl ?? ""} />
                        <AvatarFallback>{citizen?.firstName[0] ?? "I"}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 grow">
                        <h4 className="text-sm font-semibold">{citizen.fullName}</h4>
                        <p className="text-sm">{citizen.gender?.value}</p>
                        <p className="text-sm">{citizen.status?.value}</p>
                        {citizen.isWanted && <p className="text-sm text-error">Recherché</p>}
                        <div className="text-muted-foreground text-xs">
                            Ajouté le {dayjs(citizen.createdAt).format("DD/MM/YYYY à HH:mm:ss")}
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
