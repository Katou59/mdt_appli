"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosClient, { getData } from "@/lib/axiosClient";
import UserComponent from "@/components/UserComponent";
import User from "@/types/class/User";
import Alert from "@/components/Alert";
import Loader from "@/components/Loader";
import Page from "@/components/Page";
import { UserType } from "@/types/db/user";
import { useUser } from "@/lib/Contexts/UserContext";
import Rank from "@/types/class/Rank";
import Job from "@/types/class/Job";
import { useAlert } from "@/lib/Contexts/AlertContext";
import { MetadataType } from "@/types/utils/metadata";
import { set } from "zod";

export default function UpdateUser() {
    const params = useParams<{ id: string }>();
    const [user, setUser] = useState<User>();
    const [isLoaded, setIsLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { user: currentUser } = useUser();
    const { setAlert } = useAlert();
    const [ranks, setRanks] = useState<{ initialRanks: Rank[]; currentRanks: Rank[] }>({
        initialRanks: [],
        currentRanks: [],
    });
    const [jobs, setJobs] = useState<Job[]>([]);
    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        async function init() {
            const result = await getData(axiosClient.get(`/users/${params.id}`));
            if (result.errorMessage) {
                setErrorMessage(result.errorMessage);
                setIsLoaded(true);
                return;
            }

            const user = new User(result.data);
            setUser(user);

            const metadataResult = await getData(axiosClient.get("/metadata"));
            if (metadataResult.errorMessage) {
                setAlert({ title: "Erreur", description: metadataResult.errorMessage });
                return;
            }
            const metatadata = metadataResult.data as MetadataType;

            setJobs(metatadata.jobs.map((job) => new Job(job)));
            setRanks({
                initialRanks: metatadata.ranks.map((rank) => new Rank(rank)),
                currentRanks: metatadata.ranks
                    .map((rank) => new Rank(rank))
                    .filter((rank) => rank.job?.id === user.rank?.job?.id),
            });
            setRoles(metatadata.roles.map((role) => ({ id: role.key, name: role.value })));

            setIsLoaded(true);
        }

        init();
    }, [params.id]);

    if (!isLoaded) return <Loader />;

    return (
        <Page title={`Modification ${user?.fullName || ""}`}>
            {user && (
                <UserComponent
                    user={user!.toType()}
                    isConsult={false}
                    isAdmin={currentUser!.isAdmin}
                    jobs={jobs.map((job) => ({ label: job.name!, value: String(job.id) }))}
                    ranks={ranks.currentRanks.map((rank) => ({
                        label: rank.name!,
                        value: String(rank.id),
                    }))}
                    onJobChange={async (jobId: string) => {
                        const filteredRanks = ranks.initialRanks.filter(
                            (rank) => rank.job?.id === Number(jobId)
                        );

                        setRanks((prev) => ({ ...prev, currentRanks: filteredRanks }));
                    }}
                    roles={roles.map((role) => ({ label: role.name, value: String(role.id) }))}
                />
            )}
        </Page>
    );
}
