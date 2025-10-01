"use client";

import UserComponent from "@/components/UserComponent";
import {useUser} from "@/lib/Contexts/UserContext";

export default function Me() {
    const {user} = useUser();
    return <UserComponent user={user!} isConsult={true}/>
}