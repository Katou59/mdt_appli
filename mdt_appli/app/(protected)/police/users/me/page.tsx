"use client";

import {UserToUpdate, UserType} from "@/types/db/user";
import {useSession} from "next-auth/react";
import axiosClient from "@/lib/axiosClient";
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {useRouter} from "next/navigation";
import Toast from "@/components/Toast";

export default function Me() {
    const {data, status} = useSession();
    const [user, setUser] = useState<UserType | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!data?.user?.discordId) return;
        axiosClient.get(`/users/${data.user.discordId}`).then(res => setUser(res.data));
    }, [data]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        await axiosClient.put(`/users`, {
            id: user?.id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            number: user?.number,
        } as UserToUpdate);

        setIsSuccess(true);
    }

    async function onReset(e: React.FormEvent) {
        e.preventDefault();
        setIsSuccess(false);
        if (data?.user?.discordId) {
            const res = await axiosClient.get(`/users/${data.user.discordId}`);
            setUser(res.data);
        }
    }

    if (status === "loading") return <p>Chargement…</p>;
    if (status === "unauthenticated") {
        router.push("/");
        return null;
    }

    if (!user) return <p>Chargement du profil…</p>;

    return (
        <div className="w-full h-full">
            <h1 className="text-4xl font-bold text-primary text-center">Mon profil</h1>
            <form onSubmit={onSubmit} onReset={onReset} className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">Nom</legend>
                        <input
                            type="text"
                            name="lastName"
                            className="input w-full"
                            placeholder="Nom"
                            value={user.lastName ?? ""}
                            onChange={e => {
                                setIsSuccess(false);
                                setUser({
                                    ...user,
                                    lastName: e.target.value,
                                })
                            }}
                            required={true}/>
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Prénom</legend>
                        <input type="text"
                               name="firstName"
                               className="input w-full"
                               placeholder="Prénom"
                               value={user.firstName ?? ""}
                               onChange={e => {
                                   setIsSuccess(false);
                                   setUser({
                                       ...user,
                                       firstName: e.target.value,
                                   })
                               }}
                               required={true}/>
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Matricule</legend>
                        <input type="number"
                               name="number"
                               className="input w-full"
                               placeholder="Matricule"
                               min={1}
                               max={5000}
                               value={user.number ?? ""}
                               onChange={e => {
                                   setIsSuccess(false);
                                   setUser({
                                       ...user,
                                       number: Number(e.target.value),
                                   })
                               }}
                               required={true}/>
                    </fieldset>
                </div>
                <div className="flex flex-row justify-center mt-4">
                    <button type="reset" className="btn btn-error rounded-l-xl w-32">Annuler</button>
                    <button type="submit" className="btn btn-success rounded-r-xl w-32">Valider</button>
                </div>
            </form>
            {isSuccess && (
                <Toast message="Mise à jour effectuée" type="success"/>
            )}
        </div>
    )
} 