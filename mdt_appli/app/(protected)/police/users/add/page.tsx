"use client";

import InputWithLabel from "@/components/InputWithLabel";
import Loader from "@/components/Loader";
import Page from "@/components/Page";
import SelectWithLabel from "@/components/SelectWithLabel";
import axiosClient, { getData } from "@/lib/axiosClient";
import { useUser } from "@/lib/Contexts/UserContext";
import Job from "@/types/class/Job";
import Rank from "@/types/class/Rank";
import { JobType } from "@/types/db/job";
import { RankType } from "@/types/db/rank";
import { UserToCreateType } from "@/types/db/user";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AddUserForm } from "./AddUserForm";
import { toast } from "sonner";
import { useAlert } from "@/lib/Contexts/AlertContext";

export default function AddUser() {
    const { user } = useUser();
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [ranks, setRanks] = useState<Rank[]>([]);
    const { setAlert } = useAlert();

    useEffect(() => {
        async function init() {
            if (!user?.isAdmin) {
                router.push("/police/dashboard");
                return;
            }

            const jobsResponse = await getData(axiosClient.get("/jobs"));
            if (jobsResponse.errorMessage) {
                setAlert({ title: "Erreur", description: jobsResponse.errorMessage });
                setIsLoaded(true);
                return;
            }

            setJobs((jobsResponse.data as JobType[]).map((x) => new Job(x)));
            setIsLoaded(true);
        }

        init();
    }, [router, user]);

    if (!isLoaded) return <Loader />;

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

        toast.success("Utilisateur créé avec succés", {
            className: "bg-red-500",
        });

        return true;
    }

    return (
        <Page title="Ajouter un nouvel utilisateur">
            <AddUserForm
                onSubmit={onSubmit}
                jobs={jobs.map((x) => ({ value: String(x.id), label: x.name! }))}
                ranks={ranks.map((x) => ({ value: String(x.id), label: x.name! }))}
                onJobChange={async (e: string) => {
                    const value = e ? Number(e) : undefined;

                    const ranksResponse = await getData(axiosClient.get(`/ranks/${value}`));
                    if (ranksResponse.errorMessage) {
                        setAlert({ title: "Erreur", description: ranksResponse.errorMessage });
                        return;
                    }

                    const ranks = (ranksResponse.data as RankType[]).map((x) => new Rank(x));

                    setRanks(ranks);
                }}
            />
        </Page>
    );
}
