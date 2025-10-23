"use client";

import Pagination from "@/components/Pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import User from "@/types/class/User";
import { UserType } from "@/types/db/user";
import { PagerType } from "@/types/response/pagerType";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
    pager: PagerType<UserType>;
    onPageChange: (page: number) => void;
};

export default function TableAgents({ pager, onPageChange }: Props) {
    const router = useRouter();

    return (
        <div className="w-full grid gap-5">
            <div className="[&>div]:rounded-sm [&>div]:border">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Nom/Prénom</TableHead>
                            <TableHead>Matricule</TableHead>
                            <TableHead>Téléphone</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pager.items.map((u) => {
                            const user = new User(u);
                            return (
                                <TableRow
                                    key={user.id}
                                    className="hover:cursor-pointer"
                                    onClick={() => router.push(`/police/users/${user.id}`)}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="font-medium">
                                                {user.fullName ?? "Inconnu"}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.number ?? "Inconnu"}</TableCell>
                                    <TableCell>{user.phoneNumber ?? "Inconnu"}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            <Pagination pager={pager} onPageChange={onPageChange} />
        </div>
    );
}
