"use client";

import Page from "@/components/Page";
import UserConsult from "@/components/UserConsult";
import { useUser } from "@/lib/Contexts/UserContext";

export default function Me() {
    const { user } = useUser();
    return (
        <Page title="Mon profil">
            <UserConsult userToUpdate={user!} updateHref="/police/users/me/update" />
        </Page>
    );
}
