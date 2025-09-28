"use client";

import {UserToUpdate, UserType} from "@/types/db/user";
import {useSession} from "next-auth/react";
import axiosClient from "@/lib/axiosClient";
import {useEffect, useState} from "react";
import {redirect} from "next/navigation";
import {useRouter} from "next/navigation";

export default function Me() {
    const {data, status} = useSession();
    const [user, setUser] = useState<UserType>();
    const router = useRouter();

    if(status == "loading") return <></>
    if(status == "unauthenticated") return redirect("/");

    useEffect(() => {
        if (!data?.user?.discordId) return;

        axiosClient.get(`/users/${data.user.discordId}`).then((res) => {
            setUser(res.data);
        });
    }, [data])

    function onSubmit(e: any) {
        e.preventDefault();

        const res = axiosClient.put(`/users`, {
            id: user?.id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            number: user?.number
        } as UserToUpdate).then((res) => {
            setUser(res.data);
        });
        
        router.refresh();
    }

    function onReset(e: any) {
        e.preventDefault();

        axiosClient.get(`/users/${data!.user.discordId}`).then((res) => {
            setUser(res.data);
        });
    }

    if (!user) return <></>;

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
                            onChange={e =>
                                setUser({
                                    ...user,
                                    lastName: e.target.value,
                                })
                            }
                            required={true}/>
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Prénom</legend>
                        <input type="text"
                               name="firstName"
                               className="input w-full"
                               placeholder="Prénom"
                               value={user.firstName ?? ""}
                               onChange={e =>
                                   setUser({
                                       ...user,
                                       firstName: e.target.value,
                                   })
                               }
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
                               onChange={e =>
                                   setUser({
                                       ...user,
                                       number: Number(e.target.value),
                                   })
                               }
                               required={true}/>
                    </fieldset>
                </div>
                <div className="flex flex-row justify-center mt-4">
                    <button type="reset" className="btn btn-error rounded-l-xl w-32">Annuler</button>
                    <button type="submit" className="btn btn-success rounded-r-xl w-32">Valider</button>
                </div>
            </form>
        </div>
    )
} 