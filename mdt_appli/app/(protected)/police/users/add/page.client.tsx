"use client";

import Page from "@/components/Page";
import axiosClient, { getData } from "@/lib/axiosClient";
import Rank from "@/types/class/Rank";
import { UserToCreateType } from "@/types/db/user";
import React, { useState } from "react";
import { AddUserForm } from "./AddUserForm";
import { toast } from "sonner";
import { useAlert } from "@/lib/Contexts/AlertContext";
import { MetadataType } from "@/types/utils/metadata";

type Props = {
    metadata: MetadataType;
};

export default function AddUserClient({ metadata }: Props) {
    const [ranks, setRanks] = useState<Rank[]>([]);
    const { setAlert } = useAlert();

    async function onSubmit(values: UserToCreateType): Promise<boolean> {
        const userCreated = await getData(axiosClient.post("/users", values));

        if (userCreated.status === 409) {
            setAlert({ title: "Erreur", description: "Un utilisateur avec cet id éxiste déjà" });
            return false;
        }
        if (userCreated.errorMessage) {
            setAlert({ title: "Erreur", description: userCreated.errorMessage });
            return false;
        }

        toast.success("Utilisateur créé avec succés");

        return true;
    }

    return (
        <Page title="Ajouter un nouvel utilisateur">
            <AddUserForm
                onSubmit={onSubmit}
                jobs={metadata.jobs.map((x) => ({ value: String(x.id), label: x.name! }))}
                ranks={ranks.map((x) => ({ value: String(x.id), label: x.name! }))}
                onJobChange={async (e: string) => {
                    const value = e ? Number(e) : undefined;

                    const ranks = metadata.ranks
                        .filter((x) => x.job?.id === value)
                        .map((x) => new Rank(x));

                    setRanks(ranks);
                }}
            />
        </Page>
    );
}
