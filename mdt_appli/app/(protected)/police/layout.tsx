import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/lib/Contexts/UserContext";
import { UserRepository } from "@/repositories/userRepository";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { AlertProvider } from "@/lib/Contexts/AlertContext";
import { MetadataProvider } from "@/lib/Contexts/MetadataContext";

export default async function ProtectedLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();

    if (!session?.user?.discordId) return redirect("/");

    const user = await UserRepository.Get(session.user.discordId);

    if (user?.isDisable || (user?.rank?.job?.id !== 1 && !user?.isAdmin)) {
        return redirect("/");
    }

    return (
        <SessionProvider>
            <MetadataProvider>
                <UserProvider initialUser={user.toType()}>
                    <SidebarProvider>
                        <AppSidebar isAdmin={user.isAdmin} />
                        <SidebarInset>
                            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
                                <AlertProvider>{children}</AlertProvider>
                            </div>
                        </SidebarInset>
                    </SidebarProvider>
                </UserProvider>
            </MetadataProvider>
        </SessionProvider>
    );
}
