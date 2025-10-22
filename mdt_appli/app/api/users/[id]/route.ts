import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/repositories/userRepository";
import { auth } from "@/auth";
import { HttpStatus } from "@/types/enums/httpStatus";
import ErrorLogRepository from "@/repositories/errorLogRepository";
import HistoryRepository from "@/repositories/historyRepository";
import { UserToUpdateType } from "@/types/db/user";
import RankRepository from "@/repositories/rankRepository";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();

        if (!session?.user?.discordId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const currentUser = await UserRepository.Get(session.user.discordId);
        if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await context.params;

        const userResult = await UserRepository.Get(id);

        if (!userResult) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!currentUser.isAdmin && currentUser.id !== userResult.id) {
            userResult.email = null;
        }

        return NextResponse.json(userResult);
    } catch (error) {
        ErrorLogRepository.Add({
            error: error,
            path: request.nextUrl.href,
            request: null,
            userId: (await auth())!.user!.discordId!,
            method: request.method,
        });
        if (error instanceof Error)
            return NextResponse.json(
                { error: error.message },
                { status: HttpStatus.INTERNAL_SERVER_ERROR }
            );
        return NextResponse.json(
            { error: "Internal server error" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function PUT(request: NextRequest) {
    let body: UserToUpdateType | null = null;
    try {
        const session = await auth();
        const currentUser = await UserRepository.Get(session!.user.discordId!);

        body = (await request.json()) as UserToUpdateType;
        if (!body?.id) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

        const userToUpdate = await UserRepository.Get(body.id);
        if (!userToUpdate?.id) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

        const userToUpdateCopy = { ...userToUpdate };

        userToUpdate.update(body);

        if (currentUser?.isAdmin) {
            const ranks = await RankRepository.GetList();
            const rank = ranks.find((r) => r.id === body!.rankId);
            if (!rank) {
                return NextResponse.json({ error: "Rank not found" }, { status: 400 });
            }
            userToUpdate.rank = rank;
            userToUpdate.isDisable = body.isDisable ?? userToUpdate.isDisable;
            userToUpdate.role = {
                key: body.roleId!,
                value: "", // The value will be set in the repository based on the key
            };
        }

        const isSelf = session!.user.discordId === userToUpdate.id;

        if (currentUser?.isDisable || (!currentUser?.isAdmin && !isSelf)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await UserRepository.update(userToUpdate);

        const userUpdated = await UserRepository.Get(userToUpdate.id);

        HistoryRepository.Add({
            action: "update",
            entityId: userUpdated?.id ?? null,
            entityType: "user",
            newData: userUpdated,
            oldData: userToUpdateCopy,
            userId: session!.user!.discordId!,
        });

        return NextResponse.json(userUpdated);
    } catch (error) {
        ErrorLogRepository.Add({
            error: error,
            path: request.nextUrl.href,
            request: body,
            userId: (await auth())!.user!.discordId!,
            method: request.method,
        });
        if (error instanceof Error)
            return NextResponse.json(
                { error: error.message },
                { status: HttpStatus.INTERNAL_SERVER_ERROR }
            );
        return NextResponse.json(
            { error: "Internal server error" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
