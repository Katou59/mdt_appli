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

const items = [
    {
        id: "1",
        name: "Philip George",
        src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
        fallback: "PG",
        email: "philipgeorge20@gmail.com",
        location: "Mumbai, India",
        status: "Active",
        balance: "$10,696.00",
    },
    {
        id: "2",
        name: "Tiana Curtis",
        src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
        fallback: "TC",
        email: "tiana12@yahoo.com",
        location: "New York, US",
        status: "applied",
        balance: "$0.00",
    },
    {
        id: "3",
        name: "Jaylon Donin",
        src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
        fallback: "JD",
        email: "jaylon23d.@outlook.com",
        location: "Washington, US",
        status: "Active",
        balance: "$569.00",
    },
    {
        id: "4",
        name: "Kim Yim",
        src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
        fallback: "KY",
        email: "kim96@gmail.com",
        location: "Busan, South Korea",
        status: "Inactive",
        balance: "-$506.90",
    },
];

type Props = {
    pager: Pager<Citizen, CitizenType>;
};

const TableCitizens = ({ pager }: Props) => {
    return (
        <div className="w-full">
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
                                <TableCell>{citizen.phoneNumber}</TableCell>
                                <TableCell>
                                    {citizen.createdBy.fullName}{" "}
                                    {dayjs(citizen.createdAt).format("DD/MM/YYYY hh:mm:ss")}
                                </TableCell>
                                <TableCell>
                                    {citizen.updatedBy.fullName}{" "}
                                    {dayjs(citizen.updatedAt).format("DD/MM/YYYY hh:mm:ss")}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TableCitizens;
