"use client";

import {useState} from "react";
import {UserToUpdateType, UserType} from "@/types/db/user";
import axiosClient from "@/lib/axiosClient";
import Toast from "@/components/Toast";
import {useUser} from "@/lib/Contexts/UserContext";
import dayjs from "dayjs";
import User from "@/types/class/User";

export default function UserComponent(props: { user: User, isConsult: boolean }) {
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [userUpdated, setUserUpdated] = useState<User>(props.user);
    const {user, setUser} = useUser();
    
    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const userUpdatedResult = await axiosClient.put(`/users`, {
            id: userUpdated?.id,
            firstName: userUpdated?.firstName,
            lastName: userUpdated?.lastName,
            number: userUpdated?.number,
            phoneNumber: userUpdated?.phoneNumber,
        } as UserToUpdateType);
        
        setIsSuccess(true);
        setUserUpdated(new User(userUpdatedResult.data as UserType));

        if (userUpdated?.id == props.user.id) {
            setUser(userUpdatedResult.data as UserType);
        }
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
            <h1 className="text-4xl font-bold text-primary text-center mb-4">
                {user?.id == userUpdated.id && "Mon profil"}
                {user?.id != userUpdated.id && `Profil de ${userUpdated?.firstName} ${userUpdated?.lastName}`}
            </h1>
            <form onSubmit={onSubmit} onReset={onReset}>
                <div className="grid grid-cols-2 gap-4">
                    {props.isConsult && (
                        <>
                            <fieldset className="fieldset w-full">
                                <legend className="fieldset-legend">Id Discord</legend>
                                <div
                                    className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">{userUpdated.id}
                                </div>
                            </fieldset>
                            <fieldset className="fieldset w-full">
                                <legend className="fieldset-legend">Nom Discord</legend>
                                <div
                                    className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">{userUpdated.name}
                                </div>
                            </fieldset>
                            <fieldset className="fieldset w-full">
                                <legend className="fieldset-legend">Email</legend>
                                <div
                                    className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">{userUpdated.email}
                                </div>
                            </fieldset>
                            <div className="divider col-span-2"></div>
                            <fieldset className="fieldset w-full">
                                <legend className="fieldset-legend">Date de création</legend>
                                <div
                                    className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">{dayjs(userUpdated.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                                </div>
                            </fieldset>
                            <fieldset className="fieldset w-full">
                                <legend className="fieldset-legend">Date première connexion</legend>
                                <div
                                    className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">{dayjs(userUpdated.firstLogin).format("DD/MM/YYYY HH:mm:ss")}
                                </div>
                            </fieldset>
                            <fieldset className="fieldset w-full">
                                <legend className="fieldset-legend">Date dernière connexion</legend>
                                <div
                                    className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">{dayjs(userUpdated.lastLogin).format("DD/MM/YYYY HH:mm:ss")}
                                </div>
                            </fieldset>
                            <div className="divider col-span-2"></div>
                            <fieldset className="fieldset w-full">
                                <legend className="fieldset-legend">Rôle</legend>
                                <div
                                    className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">{userUpdated.rank?.Job?.name}
                                </div>
                            </fieldset>
                            <fieldset className="fieldset w-full">
                                <legend className="fieldset-legend">Grade</legend>
                                <div
                                    className="w-full p-2 rounded-md bg-base-200 text-xl font-bold h-10">{userUpdated.rank?.name}
                                </div>
                            </fieldset>
                        </>
                    )}
                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">Nom</legend>
                        {props.isConsult && (
                            <div
                                className="w-full p-2 rounded-md bg-base-200 text-xl font-bold">{userUpdated.lastName}
                            </div>
                        )}
                        {!props.isConsult && (
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
                        )}
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Prénom</legend>
                        {props.isConsult && (
                            <div
                                className="w-full p-2 rounded-md bg-base-200 text-xl font-bold">{userUpdated.firstName}</div>
                        )}
                        {!props.isConsult && (
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
                                   disabled={props.isConsult}
                                   required={true}/>
                        )}
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Matricule</legend>
                        {props.isConsult && (
                            <div
                                className="w-full p-2 rounded-md bg-base-200 text-xl font-bold">{userUpdated.number}</div>
                        )}
                        {!props.isConsult && (
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
                                   disabled={props.isConsult}
                                   required={true}/>
                        )}
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Téléphone</legend>
                        {props.isConsult && (
                            <div
                                className="w-full p-2 rounded-md bg-base-200 text-xl font-bold">{userUpdated.phoneNumber}</div>
                        )}
                        {!props.isConsult && (
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
                                   disabled={props.isConsult}
                                   required={true}/>
                        )}
                    </fieldset>
                </div>
                {
                    !props.isConsult && (
                        <div className="flex flex-row justify-center mt-4">
                            <button type="reset" className="btn btn-error rounded-l-xl w-32">Annuler</button>
                            <button type="submit" className="btn btn-success rounded-r-xl w-32">Valider</button>
                        </div>
                    )
                }
            </form>
            {
                isSuccess && (
                    <Toast message="Mise à jour effectuée" type="success"/>
                )
            }
        </div>
    )
}