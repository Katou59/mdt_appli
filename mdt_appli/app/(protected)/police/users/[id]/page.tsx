"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosClient, { getData } from "@/lib/axiosClient";
import User from "@/types/class/User";
import Loader from "@/components/Loader";
import Page from "@/components/Page";
import UserConsult from "@/components/UserConsult";
import { useAlert } from "@/lib/Contexts/AlertContext";

export default function UserId() {
    const params = useParams<{ id: string }>();
    const [user, setUser] = useState<User>();
    const [isLoaded, setIsLoaded] = useState(false);
    const { setAlert } = useAlert();

    useEffect(() => {
        async function init() {
            const result = await getData(axiosClient.get(`/users/${params.id}`));
            if (result.errorMessage) {
                setAlert({ title: "Erreur", description: result.errorMessage });
                setIsLoaded(true);
                return;
            }

            setUser(new User(result.data));
            setIsLoaded(true);
        }

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    if (!isLoaded) return <Loader />;

    return (
        <Page title={`Utilisateur ${user?.fullName || ""}`}>
            {user && <UserConsult userToUpdate={user.toType()} />}
        </Page>
    );
}
