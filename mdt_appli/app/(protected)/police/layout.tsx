import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserProvider } from "@/lib/Contexts/UserContext";
import { UserName } from "@/components/UserName";
import Image from "next/image";
import { UserRepository } from "@/repositories/userRepository";
import { ToastProvider } from "@/lib/Contexts/ToastContext";
import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { SessionProvider } from "next-auth/react";

export default async function ProtectedLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();

    if (!session?.user?.discordId) return redirect("/");

    const user = await UserRepository.get(session.user.discordId);

    if (user?.isDisable || (user?.rank?.job?.id !== 1 && !user?.isAdmin)) {
        return redirect("/");
    }

    return (
        <SessionProvider>
            <UserProvider initialUser={user.toType()}>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
                    </SidebarInset>
                </SidebarProvider>
            </UserProvider>
        </SessionProvider>
    );
}

//            <div className="w-full h-full min-h-full">
//                <div className="w-[250px]">
//                    <div className="fixed h-screen flex flex-col bg-base-200 pt-2 pb-2 w-[250px]">
//                        <div className="flex flex-col justify-center">
//                            <Link href="/" className="m-auto">
//                                <Image
//                                    src="/logolspd.webp"
//                                    alt="Logo police"
//                                    width={100}
//                                    height={100}
//                                    className="m-auto"
//                                />
//                            </Link>
//                            <ul className="menu w-full mt-4">
//                                {/*<li className="menu-title">Title</li>*/}
//                                {topItems.map((item, index) => (
//                                    <li key={index}>
//                                        <Link href={item.link}>{item.name}</Link>
//                                    </li>
//                                ))}
//                            </ul>
//                        </div>
//                        <div className="grow"></div>
//                        <ul className="menu bg-base-200 rounded-box w-full custom-menu">
//                            {user.isAdmin && (
//                                <li>
//                                    <details>
//                                        <summary>Admin</summary>
//                                        <ul className="">
//                                            {adminItems.map((item, index) => (
//                                                <li key={index}>
//                                                    <Link href={item.link}>{item.name}</Link>
//                                                </li>
//                                            ))}
//                                        </ul>
//                                    </details>
//                                </li>
//                            )}
//
//                            {botItems.map((item, index) => {
//                                return (
//                                    <li key={index}>
//                                        <Link href={item.link}>{item.name}</Link>
//                                    </li>
//                                );
//                            })}
//                        </ul>
//                        <form action={logoutAction} className="flex justify-center">
//                            <button
//                                type="submit"
//                                className="link link-hover text-error mb-2 text-sm"
//                            >
//                                Déconnexion
//                            </button>
//                        </form>
//                        <UserName />
//                    </div>
//                </div>
//                <div className="grow h-auto p-4 pb-10 ml-[250px]">{children}</div>
//            </div>
