"use client";

import {useUser} from "@/lib/Contexts/UserContext";

export function UserName() {
    const {user} = useUser();

    if (!user) return null;

    return (
        <div className="text-center text-xs">
            {user.number} | {user.lastName} {user.firstName}
        </div>
    );
}