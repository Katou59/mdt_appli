"use client";

import {UserToUpdateType, UserType} from "@/types/db/user";
import axiosClient from "@/lib/axiosClient";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Toast from "@/components/Toast";
import {useUser} from "@/lib/Contexts/UserContext";

export default function Me() {
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [userUpdated, setUserUpdated] = useState<UserToUpdateType>();
    const router = useRouter();
    const {user, setUser} = useUser();

    useEffect(() => {
        if(!user) return;
        
        setUserUpdated({
            lastName: user.lastName ?? undefined,
            firstName: user.firstName ?? undefined,
            number: user.number ?? undefined,
            id: user.id,
            jobId: user.rank?.Job?.id ?? undefined,
            rankId: user.rank?.id ?? undefined,
            phoneNumber: user.phoneNumber ?? undefined,
        });
    }, [user]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const userUpdatedResult = await axiosClient.put(`/users`, {
            id: userUpdated?.id,
            firstName: userUpdated?.firstName,
            lastName: userUpdated?.lastName,
            number: userUpdated?.number,
            phoneNumber: userUpdated?.phoneNumber,
        });

        setIsSuccess(true);
        setUser(userUpdatedResult.data as UserType);
    }

    async function onReset(e: React.FormEvent) {
        e.preventDefault();
        setIsSuccess(false);
        
        if (user?.id) {
            const res = await axiosClient.get(`/users/${user.id}`);
            setUser(res.data);
        }
    }

    if (!userUpdated) return <p>Chargement du profil…</p>;

    return (
        <div className="w-full h-full">
            <h1 className="text-4xl font-bold text-primary text-center mb-4">Mon profil</h1>
            <form onSubmit={onSubmit} onReset={onReset}>
                <div className="grid grid-cols-2 gap-4">
                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">Nom</legend>
                        <input
                            type="text"
                            name="lastName"
                            className="input w-full"
                            placeholder="Nom"
                            value={userUpdated!.lastName ?? ""}
                            onChange={e => {
                                setIsSuccess(false);
                                setUserUpdated({...userUpdated!, lastName: e.target.value});
                            }}
                            autoComplete="off"
                            required={true}/>
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Prénom</legend>
                        <input type="text"
                               name="firstName"
                               className="input w-full"
                               placeholder="Prénom"
                               value={userUpdated.firstName ?? ""}
                               onChange={e => {
                                   setIsSuccess(false);
                                   setUserUpdated({...userUpdated!, firstName: e.target.value});
                               }}
                               autoComplete="off"
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
                               value={userUpdated.number ?? ""}
                               onChange={e => {
                                   setIsSuccess(false);
                                   setUserUpdated({...userUpdated!, number: Number(e.target.value)});
                               }}
                               autoComplete="off"
                               required={true}/>
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Téléphone</legend>
                        <input type="text"
                               name="phoneNumber"
                               className="input w-full"
                               placeholder="Numéro de téléphone"
                               min={1}
                               max={5000}
                               value={userUpdated.phoneNumber ?? ""}
                               onChange={e => {
                                   setIsSuccess(false);
                                   setUserUpdated({...userUpdated!, phoneNumber: e.target.value});
                               }}
                               autoComplete="off"
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