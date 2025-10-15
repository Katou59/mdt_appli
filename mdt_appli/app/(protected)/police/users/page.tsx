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
import { DataTable } from "./data-table";
import { columns, UserColumns } from "./columns";
import InputWithLabel from "@/components/InputWithLabel";
import { Button } from "@/components/ui/button";
import SelectWithLabel from "@/components/SelectWithLabel";

type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

export const payments: Payment[] = [
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
    },
    {
        id: "489e1d42",
        amount: 125,
        status: "processing",
        email: "example@gmail.com",
    },
    // ...
];

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
                const pagerResult = await getPager(pager, filter);
                console.log(pagerResult);
                setPager(pagerResult);
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

    if (isLoading) return <Loader />;

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
                    <InputWithLabel
                        label="Recherche"
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
                    <div className="flex flex-row gap-2 mt-2">
                        <SelectWithLabel
                            id="job"
                            label="Métiers"
                            className="w-50"
                            items={jobs.map((x) => ({ value: String(x.id), label: x.name! }))}
                            defaultValue="Aucun"
                            value={filter.jobId && filter.jobId > 0 ? String(filter.jobId) : "none"}
                            onValueChange={async (e: string): Promise<void> => {
                                const value = e === "none" ? undefined : Number(e);

                                setFilter((prev) => ({
                                    ...prev,
                                    jobId: value === undefined ? undefined : Number(value),
                                    rankId: undefined,
                                }));

                                if (value) {
                                    try {
                                        setRanks(await getRanks(Number(value)));
                                    } catch (error) {
                                        if (error instanceof Error) setErrorMessage(error.message);
                                        setRanks([]);
                                    }
                                } else {
                                    setRanks([]);
                                }
                            }}
                        />
                        <SelectWithLabel
                            id="rank"
                            label="Grades"
                            className="w-50"
                            items={ranks.map((x) => ({ value: String(x.id), label: x.name! }))}
                            defaultValue="Aucun"
                            disable={filter.jobId === undefined || filter.jobId < 1}
                            value={
                                filter.rankId && filter.rankId > 0 ? String(filter.rankId) : "none"
                            }
                            onValueChange={(e: string) => {
                                const value = e === "none" ? undefined : Number(e);
                                setFilter((prev) => ({ ...prev, rankId: value }));
                            }}
                        />
                        <SelectWithLabel
                            id="role"
                            label="Rôles"
                            className="w-50"
                            items={roles.map((x) => ({ value: String(x.id), label: x.name! }))}
                            defaultValue="Aucun"
                            value={
                                filter.roleId && filter.roleId > 0 ? String(filter.roleId) : "none"
                            }
                            onValueChange={(e: string) => {
                                const value = e === "none" ? undefined : Number(e);
                                setFilter((prev) => ({ ...prev, roleId: value }));
                            }}
                        />
                        <SelectWithLabel
                            id="isDisable"
                            label="Est désactivé"
                            className="w-50"
                            items={[
                                { value: "true", label: "Oui" },
                                { value: "false", label: "Non" },
                            ]}
                            defaultValue="Aucun"
                            value={
                                filter.isDisable === undefined ? "none" : String(filter.isDisable)
                            }
                            onValueChange={(e: string) => {
                                setFilter((prev) => ({
                                    ...prev,
                                    isDisable: e === "none" ? undefined : e === "true",
                                }));
                            }}
                        />
                    </div>
                    <div className="mt-2">
                        <Button variant={"ok"} groupPosisiton="left" type="submit" className="w-25">
                            Rechercher
                        </Button>
                        <Button
                            variant={"cancel"}
                            groupPosisiton="right"
                            type="reset"
                            className="w-25"
                        >
                            Annuler
                        </Button>
                    </div>
                </form>
                <div className="text-center opacity-50 mt-4 text-sm">
                    {pager.itemCount} utilisateur{pager.itemCount > 1 ? "s" : ""}
                </div>
                <DataTable
                    columns={columns}
                    data={getRows(pager.items)}
                    isSmall={true}
                    pageSize={Number(pager.itemPerPage)}
                    pageIndex={Number(pager.page)}
                    totalPage={Number(pager.pageCount)}
                    onPageChange={(page: number) => handlePageChange(page)}
                />
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

function getRows(users: User[]): UserColumns[] {
    return users.map(
        (x) =>
            ({
                discordId: x.id,
                userName: x.name,
                email: x.email,
                number: x.number,
                fullName: x.fullName,
                jobRank: `${x.rank?.job?.name}/${x.rank?.name}`,
                role: x.role.value,
                isDisable: x.isDisable ? "Oui" : "Non",
            } as UserColumns)
    );
}
