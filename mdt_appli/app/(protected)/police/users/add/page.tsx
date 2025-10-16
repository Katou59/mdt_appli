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

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const userCreated = await getData(axiosClient.post("/users", userToCreate));

        if (userCreated.status === 409) {
            setErrorMessage("Un utilisateur avec cet id éxiste déjà");
            return;
        }
        if (userCreated.errorMessage) {
            setErrorMessage(userCreated.errorMessage);
            return;
        }

        setErrorMessage("");
        setUserToCreate({ id: "", jobId: null, rankId: null });
        addToast("Utilisateur créé avec succés", "success");
    }

    return (
        <Page title="Ajouter un nouvel utilisateur">
            <Alert message={errorMessage} />
            <form
                className="flex flex-col justify-center"
                onSubmit={handleSubmit}
                onReset={() => {
                    setErrorMessage("");
                    setUserToCreate({ id: "", jobId: null, rankId: null });
                }}
            >
                <div className="grid grid-cols-2 gap-2">
                    <InputWithLabel
                        type="text"
                        id="discordId"
                        label="Id Discord"
                        className="w-full"
                        placeholder="Id Discord"
                        value={userToCreate.id}
                        onChange={(e) => {
                            setUserToCreate({ ...userToCreate, id: e.target.value });
                        }}
                        autoComplete="off"
                        required={true}
                    />
                    <SelectWithLabel
                        className="w-full"
                        id="jobId"
                        label="Métier"
                        items={jobs.map((x) => ({ value: String(x.id), label: x.name! }))}
                        defaultValue="Choisir..."
                        value={userToCreate.jobId ? String(userToCreate.jobId) : ""}
                        onValueChange={async (e) => {
                            const value = e ? Number(e) : undefined;

                            const ranksResponse = await getData(axiosClient.get(`/ranks/${value}`));
                            if (ranksResponse.errorMessage) {
                                setErrorMessage(ranksResponse.errorMessage);
                                return;
                            }

                            const ranks = (ranksResponse.data as RankType[]).map(
                                (x) => new Rank(x)
                            );

                            setUserToCreate((prev) => ({
                                ...prev,
                                jobId: Number(value),
                                rankId: null,
                            }));

                            setRanks(ranks);
                        }}
                        isRequired={Boolean(true)}
                    />
                        {/* <SelectWithLabel
                            className="select w-full"
                            value={userToCreate.rankId ? String(userToCreate.rankId) : ""}
                            id="rankId"
                            label="Grade"
                            defaultValue="Choisir..."
                            items={ranks.map((x) => ({ value: String(x.id), label: x.name! }))}
                            onValueChange={(e) => {
                                const value = e === "" ? undefined : Number(e);
                                setUserToCreate({
                                    ...userToCreate,
                                    rankId: Number(value),
                                });
                            }}
                            isRequired={true}
                        /> */}
                </div>
                <div className="flex justify-center join mt-4">
                    <button type="reset" className="btn btn-error join-item w-30">
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-success join-item w-30">
                        Valider
                    </button>
                </div>
            </form>
        </Page>
    );
}
