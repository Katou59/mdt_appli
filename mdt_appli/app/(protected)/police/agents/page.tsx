import { auth } from "@/auth";
import Alert from "@/components/Alert";
import { UserRepository } from "@/repositories/userRepository";
import React from "react";
import AgentsClient from "./page.client";

export default async function Agents() {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return <Alert type="unauthorized" />;
        }

        const user = await UserRepository.Get(session.user.discordId);
        if (!user?.id) {
            return <Alert type="unauthorized" />;
        }

        if (!user.rank?.job?.id) {
            return <Alert descrition="Métier introuvable" />;
        }

        const pager = await UserRepository.GetList({
            page: 1,
            itemPerPage: 20,
            filter: {
                isDisable: false,
                jobId: user.rank?.job?.id,
            },
        });

        return <AgentsClient pager={pager.toType()} />;
    } catch {
        return <Alert />;
    }
}
