"use client";

import * as React from "react";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    House,
    Map,
    PersonStanding,
    PieChart,
    Settings2,
    ShieldUser,
    SquareTerminal,
    User,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@/lib/Contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Citoyens",
            url: "#",
            icon: PersonStanding,
            items: [
                {
                    title: "Liste des citoyens",
                    url: "/police/citizens",
                },
                {
                    title: "Ajouter un citoyens",
                    url: "/police/citizens/add",
                },
            ],
        },
        {
            title: "Administration",
            isAdmin: true,
            url: "#",
            icon: ShieldUser,
            items: [
                {
                    title: "Ajouter un nouvel utilisateur",
                    url: "/police/users/add",
                },
                {
                    title: "Liste des utilisateurs",
                    url: "/police/users",
                },
                {
                    title: "Gérer les grades",
                    url: "/police/ranks",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Accueil",
            url: "/police/dashboard",
            icon: House,
        },
    ],
    userLinks: [
        {
            label: "Mon profil",
            href: "/police/users/me",
            icon: User
        }
    ]
};

export function AppSidebar({ isAdmin, ...props }: {isAdmin: boolean} & React.ComponentProps<typeof Sidebar>) {
    if(!isAdmin) {
        data.navMain = data.navMain.filter((item) => item.isAdmin !== true);
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="mb-5 flex items-center">
                <Link href="/">
                    <Avatar>
                        <AvatarImage src="/logolspd.webp" alt="Logo LSPD" className="h-30" />
                    </Avatar>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <NavProjects projects={data.projects} />
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser links={data.userLinks}/>
            </SidebarFooter>
        </Sidebar>
    );
}
