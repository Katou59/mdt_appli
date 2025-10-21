"use client";

import { DataTable } from "@/components/DataTable";
import Page from "@/components/Page";
import axiosClient, { getData } from "@/lib/axiosClient";
import { useAlert } from "@/lib/Contexts/AlertContext";
import Citizen from "@/types/class/Citizen";
import Pager from "@/types/class/Pager";
import { CitizenType } from "@/types/db/citizen";
import { useEffect, useState } from "react";
import { CitizenColumns, columns } from "./columns";
import { PagerType } from "@/types/response/pagerType";
import dayjs from "dayjs";
import Loader from "@/components/Loader";
import { Separator } from "@/components/ui/separator";
import SearchCitizenForm, { SearchCitizenFormOnSubmitType } from "./SearchCitizenForm";
import TableCitizens from "./Table";

type FilterType = {
    searchTerm?: string;
};

export default function Citizens() {
    const { setAlert } = useAlert();
    const [pager, setPager] = useState<Pager<Citizen, CitizenType>>(new Pager([], 0, 20, 1));
    const [isLoaded, setIsLoaded] = useState(false);
    const [filter, setFilter] = useState<FilterType>({});

    useEffect(() => {
        const init = async () => {
            try {
                setPager(await getPager(pager));
            } catch {
                setAlert({
                    title: "Erreur",
                    description: "Une erreur est survenue lors de la récupération des citoyens",
                });
            } finally {
                setIsLoaded(true);
            }
        };

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setAlert]);

    if (!isLoaded) return <Loader />;

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

                {/* <DataTable
                    columns={columns}
                    data={getRows(pager.items)}
                    keyIndex="id"
                    pageIndex={pager.page}
                    pageSize={pager.itemPerPage}
                    totalPage={pager.pageCount}
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
                    onRowClick={() => {
                        throw new Error("Not implemented");
                    }}
                    columnsToHide={["id"]}
                /> */}
            </div>
        </Page>
    );
}

function getRows(citizens: Citizen[]): CitizenColumns[] {
    return citizens.map((x) => ({
        id: x.id,
        fullname: x.fullName ?? "",
        phoneNumber: x.phoneNumber ?? "",
        photoUrl: x.photoUrl ?? "",
        createdBy: `${x.createdBy.fullName} le ${dayjs(x.createdAt).format(
            "DD/MM/YYYY à hh:mm:ss"
        )}`,
        updatedBy: `${x.updatedBy.fullName} le ${dayjs(x.updatedAt).format(
            "DD/MM/YYYY à hh:mm:ss"
        )}`,
    }));
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

    console.log(pagerResponse);

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
