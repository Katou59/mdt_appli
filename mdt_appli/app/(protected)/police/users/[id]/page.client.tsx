"use client";

import Page from "@/components/page";
import UserConsult from "@/components/user-consult";
import { useUser } from "@/lib/Contexts/UserContext";
import User from "@/types/class/User";
import { UserType } from "@/types/db/user";

type Props = {
    user: UserType;
};

export default function UserIdClient(props: Props) {
    const user = new User(props.user);
    const { user: currenUser } = useUser();
    return (
        <Page title={`Utilisateur ${user?.fullName || ""}`}>
            {user && <UserConsult userToUpdate={user.toType()} onlyRp={!currenUser.isAdmin} />}
        </Page>
    );
}
