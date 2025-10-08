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

export default function Users() {
    const { user } = useUser();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
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
    const [pager, setPager] = useState<{ current: number; total: number; max: number }>({
        current: 1,
        total: 0,
        max: 20,
    });

    useEffect(() => {
        const init = async () => {
            if (!user?.isAdmin) return redirect("/police/dashboard");

            const usersResult = await getData(axiosClient.get(`/users`));
            if (usersResult.errorMessage) {
                setErrorMessage(usersResult.errorMessage);
                setIsLoading(false);
                return;
            }
            const results = usersResult.data as UserType[];
            const allUsers = results.map((u) => new User(u));
            setOriginUsers(allUsers);
            setTotalUser(allUsers.length);

            const jobsResult = await getData(axiosClient.get("/jobs"));
            if (jobsResult.errorMessage) {
                setErrorMessage(jobsResult.errorMessage);
                setIsLoading(false);
                return;
            }
            setJobs((jobsResult.data as Job[]).map((x) => new Job(x)));

            const totalPages = Math.ceil(allUsers.length / pager.max);

            setPager((prev) => ({
                ...prev,
                current: 1,
                total: totalPages,
            }));

            setUsers(allUsers.slice(0, pager.max));
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
    }, [pager.max, user?.isAdmin]);

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

        setUsers([...results.slice(0, pager.max)]);
        setPager({ ...pager, current: 1 });
        setOriginUsers([...results]);
    }

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (e.type === "reset") {
            setFilter({ isDisable: "", searchTerm: "", jobId: null, rankId: null, roleId: null });
            const totalPages = Math.ceil(originalUsers.length / pager.max);
            setPager((prev) => ({ ...prev, current: 1, total: totalPages }));
            setUsers([...originalUsers].slice(0, pager.max));
            return;
        }

        const results = getFilteredUsers();
        setTotalUser(results.length);

        const totalPages = Math.ceil(results.length / pager.max);
        setPager((prev) => ({ ...prev, current: 1, total: totalPages }));
        setUsers(results.slice(0, pager.max));
    };

    const handlePageChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, page: number) => {
        e.preventDefault();

        const users = getFilteredUsers();

        const totalPages = Math.ceil(users.length / pager.max);
        const safePage = Math.max(1, Math.min(page, totalPages));

        const start = (safePage - 1) * pager.max;
        const end = safePage * pager.max;

        setPager((prev) => ({ ...prev, current: safePage }));

        setUsers(users.slice(start, end));
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
                    {totalUser} utilisateur{totalUser > 1 ? "s" : ""}
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
                        {(!user || users.length === 0) && (
                            <tr>
                                <td colSpan={8} className="text-center text-sm font-bold">
                                    Aucun utilisateur
                                </td>
                            </tr>
                        )}
                        {users.map((user: User) => (
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
                {pager.total > 1 && (
                    <div className="join flex justify-center mt-4">
                        <button
                            className="join-item btn w-10"
                            disabled={pager.current == 1}
                            onClick={(e) => handlePageChange(e, 1)}
                        >
                            {"<<"}
                        </button>
                        <button
                            className="join-item btn w-10"
                            disabled={pager.current == 1}
                            onClick={(e) => handlePageChange(e, pager.current - 1)}
                        >
                            {"<"}
                        </button>
                        <button className="join-item btn w-36">
                            Page {pager.current}/{pager.total}
                        </button>
                        <button
                            className="join-item btn w-10"
                            disabled={pager.current == pager.total}
                            onClick={(e) => handlePageChange(e, pager.current + 1)}
                        >
                            {">"}
                        </button>
                        <button
                            className="join-item btn w-10"
                            disabled={pager.current == pager.total}
                            onClick={(e) => handlePageChange(e, pager.total)}
                        >
                            {">>"}
                        </button>
                    </div>
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
