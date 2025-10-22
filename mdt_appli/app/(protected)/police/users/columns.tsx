"use client";

import { ColumnDef } from "@tanstack/react-table";

export type UserColumns = {
    discordId: string;
    userName: string;
    email: string;
    number: number;
    fullName: string;
    jobRank: string;
    role: string;
    status: string;
};

export const columns: ColumnDef<UserColumns>[] = [
    {
        accessorKey: "discordId",
        header: "Id Discord",
    },
    {
        accessorKey: "userName",
        header: "Nom Discord",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "number",
        header: "Matricule",
    },
    {
        accessorKey: "fullName",
        header: "Prénom Nom",
    },
    {
        accessorKey: "jobRank",
        header: "Métier/Grade",
    },
    {
        accessorKey: "role",
        header: "Rôle",
    },
    {
        accessorKey: "status",
        header: "Statut",
    },
];
