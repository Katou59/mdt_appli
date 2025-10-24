"use client";

import Page from "@/components/Page";
import axiosClient, { getData } from "@/lib/axiosClient";
import Citizen from "@/types/class/Citizen";
import Pager from "@/types/class/Pager";
import { CitizenType } from "@/types/db/citizen";
import { useState } from "react";
import { PagerType } from "@/types/response/pagerType";
import { Separator } from "@/components/ui/separator";
import SearchCitizenForm, { SearchCitizenFormOnSubmitType } from "./SearchCitizenForm";
import TableCitizens from "./Table";

type FilterType = {
    searchTerm?: string;
};

type Props = {
    pager: PagerType<CitizenType>;
};

export default function CitizensClient({ pager: pagerServer }: Props) {
    const [pager, setPager] = useState<Pager<Citizen, CitizenType>>(
        new Pager(
            pagerServer.items.map((x) => new Citizen(x)),
            pagerServer.itemCount,
            pagerServer.itemPerPage,
            pagerServer.page
        )
    );
    const [filter, setFilter] = useState<FilterType>({});

    return (
        <Page title="Liste des citoyens">
            <div className="grid w-full">
                <SearchCitizenForm
                    onSubmit={async (values: SearchCitizenFormOnSubmitType) => {
                        console.log(values);
                        const newPager = new Pager<Citizen, CitizenType>([], 0, 20, 1);
                        setPager(await getPager(newPager, { searchTerm: values.searchField }));
                        setFilter((prev) => ({ ...prev, searchTerm: values.searchField }));
                    }}
                    onCancel={async () => {
                        const newPager = new Pager<Citizen, CitizenType>([], 0, 20, 1);
                        setFilter((prev) => ({ ...prev, searchTerm: undefined }));
                        setPager(await getPager(newPager, undefined));
                    }}
                />

                <Separator className="my-5 opacity-50" />

                <TableCitizens
                    pager={pager}
                    onPageChange={async (newPage) => {
                        setPager(
                            await getPager(
                                new Pager<Citizen, CitizenType>(
                                    [],
                                    pager.itemCount,
                                    pager.itemPerPage,
                                    newPage
                                ),
                                filter
                            )
                        );
                    }}
                />
            </div>
        </Page>
    );
}

async function getPager(pager: Pager<Citizen, CitizenType>, filter?: FilterType) {
    const pagerResponse = await getData(
        axiosClient.get("/citizens", {
            params: {
                page: pager.page,
                itemPerPage: pager.itemPerPage,
                searchTerm: filter?.searchTerm ?? "",
            },
        })
    );

    if (pagerResponse.errorMessage) {
        throw new Error("Une erreur est survenue lors de la récupération des citoyens");
    }

    const pagerData = pagerResponse.data as PagerType<CitizenType>;

    return new Pager<Citizen, CitizenType>(
        pagerData.items.map((x) => new Citizen(x)),
        pagerData.itemCount,
        pagerData.itemPerPage,
        pagerData.page
    );
}
