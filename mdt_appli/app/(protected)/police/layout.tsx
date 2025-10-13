import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserProvider } from "@/lib/Contexts/UserContext";
import { UserName } from "@/components/UserName";
import Image from "next/image";
import { UserRepository } from "@/repositories/userRepository";

export default async function ProtectedLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();

    if (!session?.user?.discordId) return redirect("/");

    const user = await UserRepository.get(session.user.discordId);

    if (user?.isDisable || (user?.rank?.job?.id !== 1 && !user?.isAdmin)) {
        return redirect("/");
    }

    const topItems = [
        { name: "Accueil", link: "/police/dashboard" },
        { name: "Citoyens", link: "/police/citizens" },
        { name: "Ajouter un citoyen", link: "/police/citizens/add" },
    ];

    const botItems = [{ name: "Mon profil", link: "/police/users/me" }];

    const adminItems = [
        { name: "Ajouter un nouvel utilisateur", link: "/police/users/add" },
        { name: "Utilisateurs", link: "/police/users" },
        { name: "Grades", link: "/police/ranks" },
    ];

    async function logoutAction() {
        "use server";
        await signOut({ redirectTo: "/" });
    }

    return (
        <UserProvider initialUser={user.toType()}>
            <div className="w-full h-full min-h-full">
                <div className="w-[250px]">
                    <div className="fixed h-screen flex flex-col bg-base-200 pt-2 pb-2 w-[250px]">
                        <div className="flex flex-col justify-center">
                            <Link href="/" className="m-auto">
                                <Image
                                    src="/logolspd.webp"
                                    alt="Logo police"
                                    width={100}
                                    height={100}
                                    className="m-auto"
                                />
                            </Link>
                            <ul className="menu w-full mt-4">
                                {/*<li className="menu-title">Title</li>*/}
                                {topItems.map((item, index) => (
                                    <li key={index}>
                                        <Link href={item.link}>{item.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grow"></div>
                        <ul className="menu bg-base-200 rounded-box w-full custom-menu">
                            {user.isAdmin && (
                                <li>
                                    <details>
                                        <summary>Admin</summary>
                                        <ul className="">
                                            {adminItems.map((item, index) => (
                                                <li key={index}>
                                                    <Link href={item.link}>{item.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </li>
                            )}

                            {botItems.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <Link href={item.link}>{item.name}</Link>
                                    </li>
                                );
                            })}
                        </ul>
                        <form action={logoutAction} className="flex justify-center">
                            <button
                                type="submit"
                                className="link link-hover text-error mb-2 text-sm"
                            >
                                Déconnexion
                            </button>
                        </form>
                        <UserName />
                    </div>
                </div>
                <div className="grow h-auto p-4 pb-10 ml-[250px]">{children}</div>
            </div>
        </UserProvider>
    );
}
