"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosClient, { getData } from "@/lib/axiosClient";
import User from "@/types/class/User";
import Loader from "@/components/Loader";
import Page from "@/components/Page";
import { UserToUpdateType, UserType } from "@/types/db/user";
import { useUser } from "@/lib/Contexts/UserContext";
import Rank from "@/types/class/Rank";
import Job from "@/types/class/Job";
import { useAlert } from "@/lib/Contexts/AlertContext";
import { MetadataType } from "@/types/utils/metadata";
import { toast } from "sonner";
import UserUpdate from "@/components/UserUpdate";

export default function UpdateUser() {
    const params = useParams<{ id: string }>();
    const [user, setUser] = useState<User>();
    const [isLoaded, setIsLoaded] = useState(false);
    const { user: currentUser } = useUser();
    const { setAlert } = useAlert();
    const [ranks, setRanks] = useState<{ initialRanks: Rank[]; currentRanks: Rank[] }>({
        initialRanks: [],
        currentRanks: [],
    });
    const [jobs, setJobs] = useState<Job[]>([]);
    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function init() {
            const result = await getData(axiosClient.get(`/users/${params.id}`));
            if (result.errorMessage) {
                setAlert({ title: "Erreur", description: result.errorMessage });
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
    }, [params.id, setAlert]);

    if (!isLoaded) return <Loader />;

    async function onSubmit(updatedUser: UserToUpdateType): Promise<void> {
        const userResponse = await getData(axiosClient.put(`/users/${params.id}`, updatedUser));
        if (userResponse.errorMessage) {
            setAlert({ title: "Erreur", description: userResponse.errorMessage });
            return Promise.reject();
        }

        const resultUser = new User(userResponse.data as UserType);
        setUser(resultUser);
        toast.success("Utilisateur mis à jour avec succès");
        router.push(`/police/users/${resultUser.id}`);
        return Promise.resolve();
    }

    function onCancel() {
        router.push(`/police/users/${user?.id}`);
    }

    return (
        <Page title={`Modification ${user?.fullName || ""}`}>
            {user && (
                <UserUpdate
                    userToUpdate={user!.toType()}
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
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                />
            )}
        </Page>
    );
}
