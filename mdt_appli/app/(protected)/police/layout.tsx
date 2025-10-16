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
import { AlertProvider } from "@/lib/Contexts/AlertContext";

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
                        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                            <AlertProvider>{children}</AlertProvider>
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </UserProvider>
        </SessionProvider>
    );
}
