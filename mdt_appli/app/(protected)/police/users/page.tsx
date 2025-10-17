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
import { DataTable } from "./table";
import { columns, UserColumns } from "./columns";
import InputWithLabel from "@/components/InputWithLabel";
import { Button } from "@/components/ui/button";
import SelectWithLabel from "@/components/SelectWithLabel";
import Page from "@/components/Page";
import SearchUserForm, { SearchUserFormOnSubmitType } from "./SearchUserForm";
import { useAlert } from "@/lib/Contexts/AlertContext";
import { set } from "zod";
import { stringToNumber } from "@/lib/converters";

type FilterType = {
    searchTerm: string | undefined;
    isDisable: boolean | undefined;
    jobId: number | undefined;
    rankId: number | undefined;
    roleId: number | undefined;
};

export default function Users() {
    const { user } = useUser();
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>({
        searchTerm: undefined,
        isDisable: undefined,
        jobId: undefined,
        rankId: undefined,
        roleId: undefined,
    });
    const [pager, setPager] = useState<PagerClass<User, UserType>>(new PagerClass([], 0, 20, 1));
    const { setAlert } = useAlert();
    const router = useRouter();

    useEffect(() => {
        if (!user?.isAdmin) return redirect("/police/dashboard");

        const init = async () => {
            const jobsResult = await getData(axiosClient.get("/jobs"));
            if (jobsResult.errorMessage) {
                setAlert({ title: "Erreur", description: jobsResult.errorMessage });
                setIsLoading(false);
                return;
            }
            setJobs((jobsResult.data as Job[]).map((x) => new Job(x)));

            try {
                const pagerResult = await getPager(pager, filter);
                setPager(pagerResult);
            } catch (e) {
                if (e instanceof Error) {
                    setAlert({ title: "Erreur", description: e.message });
                } else {
                    setAlert({ title: "Erreur", description: "Erreur inconnue" });
                }
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

    const onSearchSubmit = async (e: SearchUserFormOnSubmitType) => {
        const newFilter = {
            searchTerm: e.searchField,
            isDisable: e.isDisable,
            jobId: stringToNumber(e.jobId),
            rankId: stringToNumber(e.rankId),
            roleId: stringToNumber(e.roleId),
        };

        try {
            setPager(
                await getPager(
                    new PagerClass<User, UserType>([], pager.itemPerPage, pager.itemPerPage, 1),
                    newFilter
                )
            );
            setFilter(newFilter);
        } catch (e) {
            if (e instanceof Error) {
                setAlert({ title: "Erreur", description: e.message });
            } else {
                setAlert({ title: "Erreur", description: "Erreur inconnue" });
            }
            return;
        }
    };

    const handlePageChange = async (page: number) => {
        pager.page = page;
        try {
            setPager(await getPager(pager, filter));
        } catch (e) {
            if (e instanceof Error) {
                setAlert({ title: "Erreur", description: e.message });
            } else {
                setAlert({ title: "Erreur", description: "Erreur inconnue" });
            }
            return;
        }
    };

    if (isLoading) return <Loader />;

    return (
        <Page title="Liste des utilisateurs">
            <SearchUserForm
                jobs={jobs.map((x) => ({ value: String(x.id), label: x.name! }))}
                roles={roles.map((x) => ({ value: String(x.id), label: x.name! }))}
                ranks={ranks.map((x) => ({ value: String(x.id), label: x.name! }))}
                onJobChange={async function (value: string): Promise<void> {
                    if (value) {
                        try {
                            setRanks(await getRanks(Number(value)));
                        } catch (error) {
                            if (error instanceof Error) {
                                setAlert({ title: "Erreur", description: error.message });
                            }
                            setRanks([]);
                        }
                    } else {
                        setRanks([]);
                    }
                }}
                onSubmit={onSearchSubmit}
                onCancel={async () => {
                    setRanks([]);
                    setFilter({
                        searchTerm: undefined,
                        isDisable: undefined,
                        jobId: undefined,
                        rankId: undefined,
                        roleId: undefined,
                    });

                    setPager(
                        await getPager(
                            new PagerClass<User, UserType>(
                                [],
                                pager.itemPerPage,
                                pager.itemPerPage,
                                1
                            ),
                            {
                                searchTerm: undefined,
                                isDisable: undefined,
                                jobId: undefined,
                                rankId: undefined,
                                roleId: undefined,
                            }
                        )
                    );
                }}
            />
            <div className="mt-10">
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
                    onRowClick={(value) => router.push(`/police/users/${value}`)}
                />
            </div>
        </Page>
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
