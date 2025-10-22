"use client";

import { ColumnDef } from "@tanstack/react-table";

export type CitizenColumns = {
    id: string;
    fullname: string;
    phoneNumber: string;
    photoUrl: string;
    createdBy: string;
    updatedBy: string;
};

export const columns: ColumnDef<CitizenColumns>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "fullname",
        header: "Nom/Prénom",
    },
    {
        accessorKey: "phoneNumber",
        header: "Numéro de téléphone",
    },
    {
        accessorKey: "createdBy",
        header: "Créé par",
    },
    {
        accessorKey: "updatedBy",
        header: "Mis à jour par",
    },
];
