"use client";
import User from "@/types/class/User";
import type { UserType } from "@/types/commons/user";
import { createContext, useContext, useState } from "react";

type UserContextValue = {
    user: User;
    setUser: (user: User) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({
    initialUser,
    children,
}: {
    initialUser: UserType;
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User>(new User(initialUser));

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return ctx;
}
