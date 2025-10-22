import { auth } from "@/auth";
import Alert from "@/components/Alert";
import Page from "@/components/Page";
import UserConsult from "@/components/UserConsult";
import { useUser } from "@/lib/Contexts/UserContext";
import { UserRepository } from "@/repositories/userRepository";

export const metadata = {
    title: "MDT - Mon profil",
    description: "Mon profil utilisateur.",
};

export default async function Me() {
    const session = await auth();
    if (!session?.user?.discordId) {
        return <Alert type="unauthorized" />;
    }
    const user = await UserRepository.Get(session.user.discordId);
    if (!user) {
        return <Alert type="unauthorized" />;
    }

    return (
        <Page title="Mon profil">
            <UserConsult userToUpdate={user.toType()} updateHref="/police/users/me/update" />
        </Page>
    );
}
