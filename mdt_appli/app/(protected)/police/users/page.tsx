"use client";

import { redirect, useRouter } from "next/navigation";
import { UserType } from "@/types/db/user";
import { RoleType } from "@/types/enums/roleType";
import { useUser } from "@/lib/Contexts/UserContext";
import { useEffect, useState } from "react";
import axiosClient, { getData } from "@/lib/axiosClient";
import User from "@/types/class/User";
import Rank from "@/types/class/Rank";
import Job from "@/types/class/Job";
import { RankType } from "@/types/db/rank";
import Alert from "@/components/Alert";
import { PagerType } from "@/types/response/pagerType";
import PagerClass from "@/types/class/Pager";
import Pager from "@/components/Pager";

export default function Users() {
    const { user } = useUser();
    const router = useRouter();
    const [originalUsers, setOriginUsers] = useState<User[]>([]);
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [totalUser, setTotalUser] = useState(0);
    const [filter, setFilter] = useState<{
        searchTerm: string;
        isDisable: "" | "on" | "off";
        jobId: number | null;
        rankId: number | null;
        roleId: number | null;
    }>({
        searchTerm: "",
        isDisable: "",
        jobId: null,
        rankId: null,
        roleId: null,
    });
    const [pager, setPager] = useState<PagerClass<User, UserType>>(new PagerClass([], 0, 20, 1));

    useEffect(() => {
        if (!user?.isAdmin) return redirect("/police/dashboard");

        const init = async () => {
            const jobsResult = await getData(axiosClient.get("/jobs"));
            if (jobsResult.errorMessage) {
                setErrorMessage(jobsResult.errorMessage);
                setIsLoading(false);
                return;
            }
            setJobs((jobsResult.data as Job[]).map((x) => new Job(x)));

            setPager(await getPager(pager));

            setIsLoading(false);

            const parsedRoles = Object.entries(RoleType)
                .filter(([key]) => isNaN(Number(key))) // on garde seulement les noms
                .map(([key, value]) => ({
                    id: Number(value),
                    name: key,
                }));

            setRoles(parsedRoles);
        };

        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.isAdmin]);

    function handleTh(
        e: React.MouseEvent<HTMLTableHeaderCellElement>,
        type: "name" | "email" | "number" | "lastName" | "rank" | "role" | "isDisable"
    ) {
        e.preventDefault();

        let results: User[] = getFilteredUsers();

        switch (type) {
            case "name":
                results = results.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
                break;
            case "email":
                results = results.sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""));
                break;
            case "number":
                results = results.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
                break;
            case "lastName":
                results = results.sort((a, b) =>
                    (a.lastName ?? "").localeCompare(b.lastName ?? "")
                );
                break;
            case "rank":
                results = results.sort((a, b) =>
                    (a.rank?.name ?? "").localeCompare(b.rank?.name ?? "")
                );
                break;
            case "role":
                results = results.sort((a, b) => (a.role ?? 0) - (b.role ?? 0));
                break;
        }
    }

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const handlePageChange = async (
        page: number
    ) => {
        pager.page = page;
        setPager(await getPager(pager));
    };

    if (isLoading) return <div>Chargement...</div>;

    return (
        <>
            <Alert message={errorMessage} />
            <div className="">
                <h1 className="text-4xl font-bold text-primary text-center mb-4">
                    Liste des utilisateurs
                </h1>
                <form
                    onSubmit={handleSearchSubmit}
                    onReset={handleSearchSubmit}
                    className="flex flex-col items-center"
                >
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend p-0">Recherche</legend>
                        <input
                            type="text"
                            name="search"
                            placeholder="Recherche"
                            className="input input-sm input-primary w-64"
                            value={filter.searchTerm}
                            onChange={(e) =>
                                setFilter((prev) => ({ ...prev, searchTerm: e.target.value }))
                            }
                            autoComplete="off"
                        />
                    </fieldset>
                    <div className="flex flex-row gap-2">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend p-0">Métiers</legend>
                            <select
                                className="select select-sm select-primary w-52"
                                value={filter.jobId ?? ""}
                                onChange={async (e) => {
                                    const value = Number(e.target.value);

                                    if (value) {
                                        const ranksResult = await getData(
                                            axiosClient.get(`/ranks/${value}`)
                                        );
                                        if (ranksResult.errorMessage) {
                                            setErrorMessage(ranksResult.errorMessage);
                                            setIsLoading(false);
                                            return;
                                        }

                                        setRanks(
                                            (ranksResult.data as RankType[]).map((x) => new Rank(x))
                                        );
                                    } else {
                                        setRanks([]);
                                    }

                                    setFilter((prev) => ({ ...prev, jobId: value ?? null }));
                                }}
                            >
                                <option value={""}>Tous</option>
                                {jobs.map((job) => (
                                    <option key={job.id} value={job.id ?? ""}>
                                        {job.name}
                                    </option>
                                ))}
                            </select>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend p-0">Grades</legend>
                            <select
                                className="select select-sm select-primary w-52"
                                value={filter.rankId ?? ""}
                                onChange={async (e) => {
                                    const value = Number(e.target.value);

                                    setFilter((prev) => ({ ...prev, rankId: value }));
                                }}
                                disabled={!ranks || ranks.length === 0}
                            >
                                <option value={""}>Tous</option>
                                {ranks.map((job) => (
                                    <option key={job.id} value={job.id ?? ""}>
                                        {job.name}
                                    </option>
                                ))}
                            </select>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend p-0">Rôles</legend>
                            <select
                                className="select select-sm select-primary w-52"
                                value={filter.roleId ?? ""}
                                onChange={async (e) => {
                                    const value = Number(e.target.value);

                                    setFilter((prev) => ({ ...prev, roleId: value }));
                                }}
                            >
                                <option value={""}>Tous</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id ?? ""}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend p-0">Utilisateurs désactivés</legend>
                            <select
                                className="select select-sm select-primary w-52"
                                value={filter.isDisable}
                                onChange={(e) => {
                                    const value = e.target.value as "" | "on" | "off";
                                    setFilter((prev) => ({ ...prev, isDisable: value }));
                                }}
                            >
                                <option value={""}>Tous</option>
                                <option value={"on"}>Oui</option>
                                <option value={"off"}>Non</option>
                            </select>
                        </fieldset>
                    </div>
                    <div className="join mt-2">
                        <button type="submit" className="btn btn-success btn-sm w-24 join-item">
                            Rechercher
                        </button>
                        <button type="reset" className="btn btn-error btn-sm w-24 join-item">
                            Annuler
                        </button>
                    </div>
                </form>
                <div className="text-center opacity-50 mt-4 text-sm">
                    {pager.itemCount} utilisateur{pager.itemCount > 1 ? "s" : ""}
                </div>
                <table className="table table-xs mt-4">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th
                                className="hover:cursor-pointer"
                                onClick={(e) => handleTh(e, "name")}
                            >
                                Nom Discord
                            </th>
                            <th
                                className="hover:cursor-pointer"
                                onClick={(e) => handleTh(e, "email")}
                            >
                                Email
                            </th>
                            <th
                                className="hover:cursor-pointer"
                                onClick={(e) => handleTh(e, "number")}
                            >
                                Matricule
                            </th>
                            <th
                                className="hover:cursor-pointer"
                                onClick={(e) => handleTh(e, "lastName")}
                            >
                                Nom Prénom
                            </th>
                            <th
                                className="hover:cursor-pointer"
                                onClick={(e) => handleTh(e, "rank")}
                            >
                                Grade
                            </th>
                            <th
                                className="hover:cursor-pointer"
                                onClick={(e) => handleTh(e, "role")}
                            >
                                Role
                            </th>
                            <th>Est désactivé</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!pager.items || pager.items.length === 0) && (
                            <tr>
                                <td colSpan={8} className="text-center text-sm font-bold">
                                    Aucun utilisateur
                                </td>
                            </tr>
                        )}
                        {pager.items.map((user: User) => (
                            <tr
                                key={user.id}
                                className="hover:bg-base-300 hover:cursor-pointer"
                                onClick={() => router.push(`/police/users/${user.id}`)}
                            >
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.number}</td>
                                <td>
                                    {user.lastName} {user.firstName}
                                </td>
                                <td>{user.rank?.name}</td>
                                <td>{RoleType[user.role]}</td>
                                <td>{user.isDisable ? "Oui" : "Non"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pager.pageCount > 1 && (
                    <Pager onPageChange={handlePageChange} pager={pager}/>
                )}
            </div>
        </>
    );

    function getFilteredUsers() {
        let results = originalUsers;

        if (filter.isDisable === "on") {
            results = results.filter((r) => r.isDisable);
        } else if (filter.isDisable === "off") {
            results = results.filter((r) => !r.isDisable);
        }

        if (filter.jobId) {
            results = results.filter((r) => r?.rank?.job?.id === filter.jobId);
        }

        if (filter.rankId) {
            results = results.filter((r) => r.rank?.id === filter.rankId);
        }

        if (filter.roleId) {
            results = results.filter((r) => r.role === filter.roleId);
        }

        results = results.filter((user) => {
            const fields = [
                user.name,
                user.email,
                user.firstName,
                user.lastName,
                user.id,
                user.number?.toString(),
            ];

            return fields.some((f) =>
                f?.toLowerCase().includes(filter.searchTerm.toLocaleLowerCase())
            );
        });

        return results;
    }
}

async function getPager(pager: PagerClass<User, UserType>) {
    const pagerResult = await getData(
        axiosClient.get(`/users`, {
            params: { page: pager.page, itemPerPage: pager.itemPerPage },
        })
    );
    if (pagerResult.errorMessage) {
        throw new Error(pagerResult.errorMessage);
    }

    const pagerData = pagerResult.data as PagerType<UserType>;
    return new PagerClass<User, UserType>(
        pagerData.items.map((x) => new User(x)),
        pagerData.itemCount,
        pagerData.itemPerPage,
        pagerData.page
    );
}
