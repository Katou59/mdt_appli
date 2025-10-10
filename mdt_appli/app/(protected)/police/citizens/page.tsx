"use client";

import Alert from "@/components/Alert";
import axiosClient, { getData } from "@/lib/axiosClient";
import Citizen from "@/types/class/Citizen";
import Pager from "@/types/class/Pager";
import { CitizenType } from "@/types/db/citizen";
import { PagerType } from "@/types/response/pagerType";
import dayjs from "dayjs";
import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import PagerComponent from "@/components/Pager";

export default function Citoyens() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [pager, setPager] = useState<Pager<Citizen, CitizenType>>();
    const [filter, setFilter] = useState<FilterType>({
        searchTerm: "",
    });

    useEffect(() => {
        const init = async () => {
            try {
                setPager(await getPager(1, 20, filter));
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Une erreur inconnue est survenue.");
                }
            } finally {
                setIsLoaded(true);
            }
        };

        init();
    }, [filter]);

    if (!isLoaded) return <div>Chargement...</div>;

    async function handlePageChange(page: number): Promise<void> {
        setPager(await getPager(page, pager!.itemPerPage, filter));
    }

    function handleSearchSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const searchTerm = (formData.get("search") as string) ?? "";

        setFilter((prev) => ({ ...prev, searchTerm: searchTerm }));
    }

    function handleSearchReset(): void {
        setFilter({ searchTerm: "" });
    }

    return (
        <>
            <Alert message={errorMessage} />
            <div className="">
                <h1 className="text-4xl font-bold text-primary text-center mb-4">
                    Liste des citoyens
                </h1>
                <form
                    onSubmit={handleSearchSubmit}
                    onReset={handleSearchReset}
                    className="flex flex-col items-center"
                >
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend p-0">Recherche</legend>
                        <input
                            type="text"
                            name="search"
                            placeholder="Recherche"
                            className="input input-sm input-primary w-64"
                            autoComplete="off"
                            defaultValue=""
                        />
                    </fieldset>
                    <div className="join mt-2">
                        <button type="submit" className="btn btn-success btn-sm w-24 join-item">
                            Rechercher
                        </button>
                        <button type="reset" className="btn btn-error btn-sm w-24 join-item">
                            Annuler
                        </button>
                    </div>
                </form>

                <div className="overflow-x-auto mt-4">
                    <table className="table table-xs">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Téléphone</th>
                                <th>Créé par</th>
                                <th>Modifié par</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pager?.items.map((citizen) => (
                                <tr key={citizen.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-8 w-8">
                                                    <Image
                                                        width={100}
                                                        height={100}
                                                        src={citizen.photoUrl ?? "/Image.png"}
                                                        alt="Photo de profil"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{citizen.fullName}</div>
                                                <div className="text-sm opacity-50">
                                                    {citizen.gender?.value} /{" "}
                                                    {citizen.status?.value}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{citizen.phoneNumber}</td>
                                    <td>
                                        {citizen.createdBy.number} | {citizen.createdBy.fullName} le{" "}
                                        {dayjs(citizen.createdAt).format("DD/MM/YYYY à HH:mm:ss")}
                                    </td>
                                    <td>
                                        {citizen.updatedBy.number} | {citizen.updatedBy.fullName} le{" "}
                                        {dayjs(citizen.updatedAt).format("DD/MM/YYYY à HH:mm:ss")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {pager!.pageCount > 1 && (
                    <PagerComponent pager={pager!} onPageChange={handlePageChange} />
                    )}
                </div>
            </div>
        </>
    );
}

async function getPager(
    page: number,
    itemPerPage: number,
    filter: FilterType
): Promise<Pager<Citizen, CitizenType>> {
    const pagerResponse = await getData(
        axiosClient.get("/citizens", {
            params: { page: page, result: itemPerPage ?? 20, search: filter.searchTerm },
        })
    );
    if (pagerResponse.errorMessage) {
        throw new Error(pagerResponse.errorMessage);
    }

    const pagerType = pagerResponse.data as PagerType<CitizenType>;

    return new Pager(
        pagerType.items.map((x) => new Citizen(x)),
        pagerType.itemCount,
        pagerType.itemPerPage,
        pagerType.page
    );
}

type FilterType = {
    searchTerm: string;
};
