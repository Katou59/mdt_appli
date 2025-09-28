import {auth, signOut} from "@/auth";
import {redirect} from "next/navigation";
import Link from "next/link";
import {UserType} from "@/types/db/user";
import {createAxiosServer} from "@/lib/axiosServer";

export default async function ProtectedLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    const session = await auth();

    if (!session?.user) redirect("/");

    const axiosServer = await createAxiosServer();
    const res = await axiosServer.get(`/users/${session?.user?.discordId}`);
    const user: UserType = await res.data;

    const topItems = [
        {name: "Accueil", link: "/police/dashboard"},
    ];

    const botItems = [
        {name: "Profil", link: "/police/users/me"},
    ]

    async function logoutAction() {
        "use server";
        await signOut({redirectTo: "/"});
    }

    return (
        <div className="flex flex-row w-full h-full min-h-full">
            <div className="h-full min-h-full w-56 flex flex-col bg-base-200 rounded-box ">
                <div className="w-full">
                    <h1 className="text-4xl font-bold text-center mt-4">Police</h1>
                    <ul className="menu w-full">
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
                    <ul className="menu w-full">
                        {botItems.map((item, index) => (
                            <li key={index}>
                                <Link href={item.link}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                    <form action={logoutAction} className="w-full">
                        <button
                            type="submit"
                            className="link link-hover text-error mb-2 ml-4 text-sm"
                        >
                            Déconnexion
                        </button>
                    </form>
                    {user.firstName && user.lastName && user.number && (
                        <div className="text-xs text-center">{user.number} | {user.firstName} {user.lastName}</div>)
                    }
                </div>
            </div>
            <div className="grow h-full p-4">
                {children}
            </div>
        </div>
    );
}