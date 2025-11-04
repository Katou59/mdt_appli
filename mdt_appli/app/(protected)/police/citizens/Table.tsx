"use client";

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
import { CitizenType } from "@/types/commons/citizen";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { HoverCardCitizen } from "./hover-card-citizen";

type Props = {
    pager: Pager<Citizen, CitizenType>;
    onPageChange: (newPage: number) => void;
};

export default function TableCitizens({ pager, onPageChange }: Props) {
    const router = useRouter();

    return (
        <div className="w-full grid gap-5">
            <div className="text-center opacity-50 text-sm">
                {pager.itemCount} citoyen{pager.itemCount > 1 ? "s" : ""}
            </div>
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
                            <TableRow
                                key={citizen.id}
                                className="hover:cursor-pointer"
                                onClick={() => router.push(`/police/citizens/${citizen.id}`)}>
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
                                    {citizen.createdBy.number} | {citizen.createdBy.fullName}{" "}
                                    {dayjs(citizen.createdAt).format("le DD/MM/YYYY à HH:mm:ss")}
                                </TableCell>
                                <TableCell>
                                    {citizen.createdBy.number} | {citizen.updatedBy.fullName}{" "}
                                    {dayjs(citizen.updatedAt).format("le DD/MM/YYYY à HH:mm:ss")}
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
