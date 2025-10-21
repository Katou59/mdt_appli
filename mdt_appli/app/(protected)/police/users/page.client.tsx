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
import { PagerType } from "@/types/response/pagerType";
import PagerClass from "@/types/class/Pager";
import { RankType } from "@/types/db/rank";
import Loader from "@/components/Loader";
import { DataTable } from "../../../../components/DataTable";
import { columns, UserColumns } from "./columns";
import Page from "@/components/Page";
import SearchUserForm, { SearchUserFormOnSubmitType } from "./SearchUserForm";
import { useAlert } from "@/lib/Contexts/AlertContext";
import { stringToNumber } from "@/lib/converters";
import { Separator } from "@/components/ui/separator";
import { MetadataType } from "@/types/utils/metadata";
import Pager from "@/types/class/Pager";

type FilterType = {
    searchTerm: string | undefined;
    isDisable: boolean | undefined;
    jobId: number | undefined;
    rankId: number | undefined;
    roleId: number | undefined;
};

type Props = {
    metadata: MetadataType;
    pager: PagerType<UserType>;
};

export default function UsersClient({ metadata, pager: pagerServer }: Props) {
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [filter, setFilter] = useState<FilterType>({
        searchTerm: undefined,
        isDisable: undefined,
        jobId: undefined,
        rankId: undefined,
        roleId: undefined,
    });
    const [pager, setPager] = useState<PagerClass<User, UserType>>(
        new PagerClass(
            pagerServer.items.map((x) => new User(x)),
            pagerServer.itemCount,
            pagerServer.itemPerPage,
            pagerServer.page
        )
    );
    const { setAlert } = useAlert();
    const router = useRouter();

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

    // if (isLoading) return <Loader />;

    return (
        <Page title="Liste des utilisateurs">
            <div className="w-full">
                <SearchUserForm
                    jobs={metadata.jobs.map((x) => ({ value: String(x.id), label: x.name! }))}
                    roles={metadata.roles.map((x) => ({ value: String(x.key), label: x.value! }))}
                    ranks={ranks.map((x) => ({ value: String(x.id), label: x.name! }))}
                    onJobChange={async function (value: string): Promise<void> {
                        const newRanks = metadata.ranks.filter((x) => x.job?.id === Number(value));
                        setRanks(newRanks.map((x) => new Rank(x)));
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
                <Separator className="my-5 opacity-50" />
                <div>
                    <div className="text-center opacity-50 mt-4 text-sm">
                        {pager.itemCount} utilisateur{pager.itemCount > 1 ? "s" : ""}
                    </div>
                    <DataTable
                        pager={pager}
                        columns={columns}
                        data={getRows(pager.items)}
                        isSmall={true}
                        onPageChange={(page: number) => handlePageChange(page)}
                        onRowClick={(value) => router.push(`/police/users/${value}`)}
                        keyIndex="discordId"
                    />
                </div>
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
                status: x.isDisable ? "Désactivé" : "Actif",
            } as UserColumns)
    );
}
