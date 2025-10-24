import Pagination from "@/components/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Citizen from "@/types/class/Citizen";
import Pager from "@/types/class/Pager";
import { CitizenType } from "@/types/db/citizen";
import dayjs from "dayjs";
import { HoverCardCitizen } from "./hover-card-citizen";

type Props = {
    pager: Pager<Citizen, CitizenType>;
    onPageChange: (newPage: number) => void;
};

export default function TableCitizens({ pager, onPageChange }: Props) {
    return (
        <div className="w-full grid gap-5">
            <div className="[&>div]:rounded-sm [&>div]:border">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Nom/Prénom</TableHead>
                            <TableHead>Téléphone</TableHead>
                            <TableHead>Créé par</TableHead>
                            <TableHead>Mis à jour par</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pager.items.map((citizen) => (
                            <TableRow key={citizen.id}>
                                <HoverCardCitizen citizen={citizen}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage
                                                    src={citizen.photoUrl ?? ""}
                                                    alt={citizen.fullName}
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {citizen.fullName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">{citizen.fullName}</div>
                                        </div>
                                    </TableCell>
                                </HoverCardCitizen>
                                <TableCell>{citizen.phoneNumber}</TableCell>
                                <TableCell>
                                    {citizen.createdBy.fullName}{" "}
                                    {dayjs(citizen.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                                </TableCell>
                                <TableCell>
                                    {citizen.updatedBy.fullName}{" "}
                                    {dayjs(citizen.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Pagination pager={pager} onPageChange={onPageChange} />
        </div>
    );
}
