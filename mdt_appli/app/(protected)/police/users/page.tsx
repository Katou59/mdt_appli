"use client";

import { redirect, useRouter } from "next/navigation";
import { UserType } from "@/types/db/user";
import { RoleType } from "@/types/enums/roleType";
import { useUser } from "@/lib/Contexts/UserContext";
import { FormEvent, useEffect, useState } from "react";
import axiosClient, { getData } from "@/lib/axiosClient";
import User from "@/types/class/User";
import Rank from "@/types/class/Rank";
import Job from "@/types/class/Job";
import Alert from "@/components/Alert";
import { PagerType } from "@/types/response/pagerType";
import PagerClass from "@/types/class/Pager";
import Pager from "@/components/Pager";
import { RankType } from "@/types/db/rank";
import Loader from "@/components/Loader";

type FilterType = {
    searchTerm: string | undefined;
    isDisable: boolean | undefined;
    jobId: number | undefined;
    rankId: number | undefined;
    roleId: number | undefined;
};

export default function Users() {
    const { user } = useUser();
    const router = useRouter();
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [filter, setFilter] = useState<FilterType>({
        searchTerm: undefined,
        isDisable: undefined,
        jobId: undefined,
        rankId: undefined,
        roleId: undefined,
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

            try {
                setPager(await getPager(pager, filter));
            } catch (e) {
                if (e instanceof Error) setErrorMessage(e.message);
                else setErrorMessage("Erreur");
                return;
            }

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

    const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPager(await getPager(pager, filter));
    };

    const handlePageChange = async (page: number) => {
        pager.page = page;
        try {
            setPager(await getPager(pager, filter));
        } catch (e) {
            if (e instanceof Error) setErrorMessage(e.message);
            else setErrorMessage("Erreur");
        }
    };

    async function handleSearchReset(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const newFilter = {
            isDisable: undefined,
            jobId: undefined,
            rankId: undefined,
            roleId: undefined,
            searchTerm: undefined,
        };
        setFilter(newFilter);
        setPager(await getPager(pager, filter));
    }

    if (isLoading) return <Loader/>;

    return (
        <>
            <Alert message={errorMessage} />
            <div className="">
                <h1 className="text-4xl font-bold text-primary text-center mb-4">
                    Liste des utilisateurs
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
                            className="input input-sm w-64"
                            autoComplete="off"
                            value={filter.searchTerm ?? ""}
                            onChange={(e) =>
                                setFilter((prev) => ({ ...prev, searchTerm: e.target.value }))
                            }
                        />
                    </fieldset>
                    <div className="flex flex-row gap-2">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend p-0">Métiers</legend>
                            <select
                                className="select select-sm w-52"
                                value={filter.jobId ?? ""}
                                onChange={async (e) => {
                                    const value = e.target.value
                                        ? Number(e.target.value)
                                        : undefined;
                                    setFilter((prev) => ({
                                        ...prev,
                                        jobId: value,
                                        rankId: undefined,
                                    }));

                                    if (value) {
                                        try {
                                            setRanks(await getRanks(value));
                                        } catch (error) {
                                            if (error instanceof Error)
                                                setErrorMessage(error.message);
                                            setRanks([]);
                                        }
                                    } else {
                                        setRanks([]);
                                    }
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
                                className="select select-sm w-52"
                                disabled={!ranks || ranks.length === 0}
                                value={filter.rankId ?? ""}
                                onChange={(e) => {
                                    const value = e.target.value
                                        ? Number(e.target.value)
                                        : undefined;
                                    setFilter((prev) => ({ ...prev, rankId: value }));
                                }}
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
                                className="select select-sm w-52"
                                value={filter.roleId ?? ""}
                                onChange={(e) => {
                                    const value = e.target.value
                                        ? Number(e.target.value)
                                        : undefined;
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
                                className="select select-sm w-52"
                                value={
                                    filter.isDisable === undefined ? "" : String(filter.isDisable)
                                }
                                onChange={(e) => {
                                    console.log(e.target.value);
                                    setFilter((prev) => ({
                                        ...prev,
                                        isDisable:
                                            e.target.value === ""
                                                ? undefined
                                                : e.target.value === "true",
                                    }));
                                }}
                            >
                                <option value={""}>Tous</option>
                                <option value={"true"}>Oui</option>
                                <option value={"false"}>Non</option>
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
                            <th>Id Discord</th>
                            <th>Nom Discord</th>
                            <th>Email</th>
                            <th>Matricule</th>
                            <th>Nom Prénom</th>
                            <th>Grade</th>
                            <th>Role</th>
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
                                <td>{user.role.value}</td>
                                <td>{user.isDisable ? "Oui" : "Non"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pager.pageCount > 1 && <Pager onPageChange={handlePageChange} pager={pager} />}
            </div>
        </>
    );
}

async function getPager(pager: PagerClass<User, UserType>, filter: FilterType) {
    const pagerResult = await getData(
        axiosClient.get(`/users`, {
            params: { ...filter, page: pager.page, itemPerPage: pager.itemPerPage },
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

async function getRanks(jobId: number): Promise<Rank[]> {
    const ranksResult = await getData(axiosClient.get(`/ranks/${jobId}`));
    if (ranksResult.errorMessage) throw new Error(ranksResult.errorMessage);

    const results = ranksResult.data as RankType[];

    return results.map((r) => new Rank(r));
}
