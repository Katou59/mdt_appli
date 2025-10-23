import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/lib/Contexts/UserContext";
import { UserRepository } from "@/repositories/userRepository";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { AlertProvider } from "@/lib/Contexts/AlertContext";
import { MetadataProvider } from "@/lib/Contexts/MetadataContext";
import UserService from "@/services/userService";
import Alert from "@/components/Alert";

export default async function ProtectedLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();

    if (!session?.user?.discordId) return <Alert type="unauthorized" />;

    const userService = await UserService.create(session.user.discordId);
    const user = await userService.get(session.user.discordId);

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
