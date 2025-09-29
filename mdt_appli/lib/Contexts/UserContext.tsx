"use client";
import {createContext, useContext, useState} from "react";
import type {UserType} from "@/types/db/user";

type UserContextValue = {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({initialUser, children,}: { initialUser: UserType | null; children: React.ReactNode; }) {
    const [user, setUser] = useState<UserType | null>(initialUser);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return ctx;
}
