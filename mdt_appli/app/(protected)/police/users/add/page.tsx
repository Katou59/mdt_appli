"use client";

import Alert from "@/components/Alert";
import InputWithLabel from "@/components/InputWithLabel";
import Loader from "@/components/Loader";
import Page from "@/components/Page";
import SelectWithLabel from "@/components/SelectWithLabel";
import axiosClient, { getData } from "@/lib/axiosClient";
import { useToast } from "@/lib/Contexts/ToastContext";
import { useUser } from "@/lib/Contexts/UserContext";
import Job from "@/types/class/Job";
import Rank from "@/types/class/Rank";
import { JobType } from "@/types/db/job";
import { RankType } from "@/types/db/rank";
import { UserToCreateType } from "@/types/db/user";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AddUserForm } from "./AddUserForm";

export default function AddUser() {
    const { user } = useUser();
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const { addToast } = useToast();
    const [userToCreate, setUserToCreate] = useState<UserToCreateType>({
        id: "",
        jobId: null,
        rankId: null,
    });

    useEffect(() => {
        async function init() {
            if (!user?.isAdmin) {
                router.push("/police/dashboard");
                return;
            }

            const jobsResponse = await getData(axiosClient.get("/jobs"));
            if (jobsResponse.errorMessage) {
                setErrorMessage(jobsResponse.errorMessage);
                setIsLoaded(true);
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
            setErrorMessage("Un utilisateur avec cet id éxiste déjà");
            return false;
        }
        if (userCreated.errorMessage) {
            setErrorMessage(userCreated.errorMessage);
            return false;
        }

        setErrorMessage("");
        setUserToCreate({ id: "", jobId: null, rankId: null });
        addToast("Utilisateur créé avec succés", "success");
        return true;
    }

    return (
        <Page title="Ajouter un nouvel utilisateur">
            <Alert message={errorMessage} />
            <AddUserForm
                onSubmit={onSubmit}
                jobs={jobs.map((x) => ({ value: String(x.id), label: x.name! }))}
                ranks={ranks.map((x) => ({ value: String(x.id), label: x.name! }))}
                onJobChange={async (e: string) => {
                    const value = e ? Number(e) : undefined;

                    const ranksResponse = await getData(axiosClient.get(`/ranks/${value}`));
                    if (ranksResponse.errorMessage) {
                        setErrorMessage(ranksResponse.errorMessage);
                        return;
                    }

                    const ranks = (ranksResponse.data as RankType[]).map((x) => new Rank(x));

                    setUserToCreate((prev) => ({
                        ...prev,
                        jobId: Number(value),
                        rankId: null,
                    }));

                    setRanks(ranks);
                }}
            />
        </Page>
    );
}
