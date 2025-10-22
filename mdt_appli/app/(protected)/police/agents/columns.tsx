"use client";

import { ColumnDef } from "@tanstack/react-table";

export type AgentColumns = {
    discordId: string;
    number: number;
    fullName: string;
    status: string;
};

export const columns: ColumnDef<AgentColumns>[] = [
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
];
