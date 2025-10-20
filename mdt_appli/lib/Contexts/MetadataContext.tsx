"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { UserType } from "@/types/db/user";
import User from "@/types/class/User";
import { MetadataType } from "@/types/utils/metadata";
import axiosClient, { getData } from "../axiosClient";

type MetadataContextValue = {
    metadata: MetadataType | undefined;
};

const MetadataContext = createContext<MetadataContextValue | undefined>(undefined);

export function MetadataProvider({ children }: { children: React.ReactNode }) {
    const [metadata, setMetadata] = useState<MetadataType | undefined>(undefined);

    useEffect(() => {
        const init = async () => {
            const metadataResponse = await getData(axiosClient.get("/metadata"));
            if (metadataResponse.errorMessage) {
                throw new Error("Erreur lors de la récupération des metadatas");
            }

            setMetadata(metadataResponse.data as MetadataType);
        };

        init();
    }, []);

    return <MetadataContext.Provider value={{ metadata }}>{children}</MetadataContext.Provider>;
}

export function useMetadata() {
    const ctx = useContext(MetadataContext);
    if (!ctx) {
        throw new Error("useMetada must be used within a MetadataProvider");
    }
    return ctx;
}
