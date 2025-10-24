import { auth } from "@/auth";
import Alert from "@/components/alert";
import Page from "@/components/page";
import UserConsult from "@/components/user-consult";
import UserService from "@/services/user-service";

export const metadata = {
    title: "MDT - Mon profil",
    description: "Mon profil utilisateur.",
};

export default async function Me() {
    const session = await auth();
    if (!session?.user?.discordId) {
        return <Alert type="unauthorized" />;
    }

    const userService = await UserService.create(session.user.discordId);
    const user = await userService.get(session.user.discordId);
    if (!user) {
        return <Alert type="unauthorized" />;
    }

    return (
        <Page title="Mon profil">
            <UserConsult userToUpdate={user.toType()} updateHref="/police/users/me/update" />
        </Page>
    );
}
