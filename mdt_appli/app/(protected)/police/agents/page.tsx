import { auth } from "@/auth";
import Alert from "@/components/Alert";
import React from "react";
import AgentsClient from "./page.client";
import UserService from "@/services/userService";

export default async function Agents() {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return <Alert type="unauthorized" />;
        }

        const userService = await UserService.create(session.user.discordId);
        const currentUser = await userService.get(session.user.discordId);
        if (!currentUser?.id) {
            return <Alert type="unauthorized" />;
        }

        if (!currentUser.rank?.job?.id) {
            return <Alert descrition="Métier introuvable" />;
        }

        const pager = await userService.getList(1, 20, {
            isDisable: false,
            jobId: currentUser.rank.job.id,
        });

        return <AgentsClient pager={pager.toType()} />;
    } catch {
        return <Alert />;
    }
}
