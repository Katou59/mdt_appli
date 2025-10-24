"use client";

import Page from "@/components/page";
import axiosClient, { getData } from "@/lib/axios-client";
import { useAlert } from "@/lib/Contexts/AlertContext";
import Pager from "@/types/class/Pager";
import User from "@/types/class/User";
import { UsersForSeachType, UserType } from "@/types/db/user";
import { PagerType } from "@/types/response/pager-type";
import { useState } from "react";
import SearchAgentForm from "./search-agent-form";
import TableAgents from "./table";

type Props = {
    pager: PagerType<UserType>;
};

type FilterType = {
    searchTerm?: string;
};

export default function AgentsClient({ pager: pagerServer }: Props) {
    const { setAlert } = useAlert();
    const [pager, setPager] = useState<Pager<User, UserType>>(
        new Pager<User, UserType>(
            pagerServer.items.map((x) => new User(x)),
            pagerServer.itemCount,
            pagerServer.itemPerPage,
            pagerServer.page
        )
    );

    async function onPageChange(page: number) {
        try {
            const newPager = pager.clone();
            newPager.page = page;
            setPager(await getPager(newPager));
        } catch (error) {
            if (error instanceof Error) {
                setAlert({ title: "Erreur", description: error.message });
            }
        }
    }

    return (
        <Page title="Liste des agents">
            <div className="grid gap-5 w-full">
                <SearchAgentForm
                    onCancel={async () => {
                        const newPager = pager.clone();
                        newPager.page = 1;
                        setPager(await getPager(pager));
                    }}
                    onSubmit={async (values) => {
                        try {
                            const newPager = pager.clone();
                            newPager.page = 1;
                            setPager(await getPager(newPager, { searchTerm: values.searchField }));
                        } catch (error) {
                            if (error instanceof Error) {
                                setAlert({ title: "Erreur", description: error.message });
                            }
                        }
                    }}
                />
                <TableAgents pager={pager} onPageChange={onPageChange} />
            </div>
        </Page>
    );
}

async function getPager(
    pager: Pager<User, UserType>,
    filter?: FilterType
): Promise<Pager<User, UserType>> {
    const jobId = pager.items[0].rank?.job?.id;
    if (!jobId) {
        throw new Error("Erreur lors de la récupération du métier");
    }

    const pagerResult = await getData<PagerType<UserType>>(
        axiosClient.get("/users", {
            params: {
                itemPerPage: pager.itemPerPage,
                page: pager.page,
                jobId: jobId,
                isDisable: false,
                searchTerm: filter?.searchTerm,
            } as UsersForSeachType,
        })
    );

    if (pagerResult.errorMessage || !pagerResult.data) {
        throw new Error("Erreur lors de la récupération des agents");
    }

    return Pager.getFromType(pagerResult.data, (x) => new User(x));
}
