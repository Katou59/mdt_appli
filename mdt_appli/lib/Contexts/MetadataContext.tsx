"use client";
import { MetadataType } from "@/types/utils/metadata";
import { createContext, useContext, useEffect, useState } from "react";
import axiosClient, { getData } from "../axios-client";

type MetadataContextValue = {
    metadata: MetadataType | undefined;
    refresh: () => Promise<void>;
};

const MetadataContext = createContext<MetadataContextValue | undefined>(undefined);

export function MetadataProvider({ children }: { children: React.ReactNode }) {
    const [metadata, setMetadata] = useState<MetadataType | undefined>(undefined);

    const init = async () => {
        const metadataResponse = await getData(axiosClient.get("/metadata"));
        if (metadataResponse.errorMessage) {
            throw new Error("Erreur lors de la récupération des metadatas");
        }
        setMetadata(metadataResponse.data as MetadataType);
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <MetadataContext.Provider value={{ metadata, refresh: init }}>
            {children}
        </MetadataContext.Provider>
    );
}

export function useMetadata() {
    const ctx = useContext(MetadataContext);
    if (!ctx) {
        throw new Error("useMetada must be used within a MetadataProvider");
    }
    return ctx;
}
