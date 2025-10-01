import {auth, signOut} from "@/auth";
import {redirect} from "next/navigation";
import Link from "next/link";
import {UserType} from "@/types/db/user";
import {createAxiosServer} from "@/lib/axiosServer";
import {UserProvider} from "@/lib/Contexts/UserContext";
import {UserName} from "@/components/UserName";
import Image from "next/image";
import {RoleType} from "@/types/enums/roleType";

export default async function ProtectedLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    const session = await auth();

    if (!session?.user) redirect("/");

    const axiosServer = await createAxiosServer();
    const res = await axiosServer.get(`/users/${session?.user?.discordId}`);
    const user = await res.data as UserType;

    const topItems = [
        {name: "Accueil", link: "/police/dashboard"},
    ];

    const botItems = [
        {name: "Profil", link: "/police/users/me"},
    ]

    const adminItems = [
        {name: "Utilisateurs", link: "/police/users", role: RoleType.Admin},
    ]

    async function logoutAction() {
        "use server";
        await signOut({redirectTo: "/"});
    }

    return (
        <UserProvider initialUser={user}>
            <div className="flex flex-row w-full h-full min-h-full">
                <div className="w-56">
                    <div className="fixed h-full min-h-full w-56 flex flex-col bg-base-200 pt-2 pb-2">
                        <div className="w-full">
                            <Image src="/logolspd.webp" alt="Logo police" width={100} height={100} className="m-auto"/>
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
                        <div className="w-full">
                            <ul className="menu bg-base-200 rounded-box w-56">
                                {user.role == RoleType.Admin && (
                                    <li>
                                        <details>
                                            <summary>Admin</summary>
                                            <ul>
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
                            <form action={logoutAction} className="w-full">
                                <button
                                    type="submit"
                                    className="link link-hover text-error mb-2 ml-4 text-sm"
                                >
                                    Déconnexion
                                </button>
                            </form>
                            <UserName/>
                        </div>
                    </div>
                </div>
                <div className="grow h-full p-4">
                    {children}
                </div>
            </div>
        </UserProvider>
    );
}