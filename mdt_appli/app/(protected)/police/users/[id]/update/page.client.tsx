"use client";
import Loader from "@/components/loader";
import Page from "@/components/page";
import UserUpdate from "@/components/user-update";
import axiosClient, { getData } from "@/lib/axios-client";
import { useAlert } from "@/lib/Contexts/AlertContext";
import { useUser } from "@/lib/Contexts/UserContext";
import Rank from "@/types/class/Rank";
import User from "@/types/class/User";
import { UserToUpdateType, UserType } from "@/types/db/user";
import { MetadataType } from "@/types/utils/metadata";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
    user: UserType;
    metadata: MetadataType;
};

export default function UpdateUserClient({ metadata, user: userServer }: Props) {
    const params = useParams<{ id: string }>();
    const [user, setUser] = useState<User>(new User(userServer));
    const [isLoaded, setIsLoaded] = useState(false);
    const { user: currentUser } = useUser();
    const { setAlert } = useAlert();
    const [ranks, setRanks] = useState<Rank[]>([]);
    const router = useRouter();

    useEffect(() => {
        setRanks(
            metadata.ranks.filter((x) => x.job?.id === user.rank?.job?.id).map((x) => new Rank(x))
        );
        setIsLoaded(true);
    }, [metadata.ranks, params.id, user.rank?.job?.id]);

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
                    jobs={metadata.jobs.map((job) => ({ label: job.name!, value: String(job.id) }))}
                    ranks={ranks.map((rank) => ({
                        label: rank.name!,
                        value: String(rank.id),
                    }))}
                    onJobChange={async (jobId: string) => {
                        const filteredRanks = metadata.ranks.filter(
                            (rank) => rank.job?.id === Number(jobId)
                        );

                        setRanks((prev) => ({ ...prev, currentRanks: filteredRanks }));
                    }}
                    roles={metadata.roles.map((role) => ({
                        label: role.value,
                        value: String(role.key),
                    }))}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                />
            )}
        </Page>
    );
}
