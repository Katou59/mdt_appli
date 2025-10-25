"use client";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type HistoryContextValue = {
    histories: string[];
    deleteLast: () => void;
};

const HistoryContext = createContext<HistoryContextValue | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
    const [histories, setHistories] = useState<string[]>([]);
    const pathname = usePathname();

    useEffect(() => {
        setHistories((prev) => {
            if ([...prev].pop() === pathname) {
                return [...prev];
            }
            return [...prev, pathname];
        });
    }, [pathname]);

    function deleteLast() {
        setHistories((prev) => [...prev.slice(0, -1)]);
    }

    return (
        <HistoryContext.Provider value={{ histories, deleteLast }}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const ctx = useContext(HistoryContext);
    if (!ctx) {
        throw new Error("useHistory must be used within a HistoryProvider");
    }
    return ctx;
}
