"use client";

import Page from "@/components/page";
import UserConsult from "@/components/user-consult";
import User from "@/types/class/User";
import { UserType } from "@/types/db/user";

type Props = {
    user: UserType;
};

export default function UserIdClient(props: Props) {
    const user = new User(props.user);
    return (
        <Page title={`Utilisateur ${user?.fullName || ""}`}>
            {user && <UserConsult userToUpdate={user.toType()} />}
        </Page>
    );
}
