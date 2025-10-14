import { NextRequest, NextResponse } from "next/server";
import { UserToCreateType, UserToUpdateType } from "@/types/db/user";
import { auth } from "@/auth";
import { UserRepository } from "@/repositories/userRepository";
import { RoleType } from "@/types/enums/roleType";
import { HttpStatus } from "@/types/enums/httpStatus";
import HistoryRepository from "@/repositories/historyRepository";
import ErrorLogRepository from "@/repositories/errorLogRepository";

export async function PUT(request: NextRequest) {
    let body = null;
    try {
        const session = await auth();
        const currentUser = await UserRepository.get(session!.user.discordId!);

        body = (await request.json()) as UserToUpdateType;
        if (!body?.id)
            return NextResponse.json({ error: "Bad Request" }, { status: 400 });

        const userToUpdate = await UserRepository.get(body.id);
        if (!userToUpdate?.id) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

        const userToUpdateCopy = { ...userToUpdate };

        userToUpdate.update(
            body,
            currentUser?.isAdmin,
            currentUser?.role.key === RoleType.SuperAdmin
        );

        const isSelf = session!.user.discordId === userToUpdate.id;

        if (currentUser?.isDisable || (!currentUser?.isAdmin && !isSelf)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await UserRepository.update(userToUpdate);

        const userUpdated = await UserRepository.get(userToUpdate.id);

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

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        const { searchParams } = new URL(request.url);

        const page = Number(searchParams.get("page"));
        const itemPerPage = Number(searchParams.get("itemPerPage"));
        const searchTerm = searchParams.get("searchTerm") ?? undefined;
        const isDisable =
            searchParams.get("isDisable") === undefined || searchParams.get("isDisable") === null
                ? undefined
                : searchParams.get("isDisable") === "true";
        const jobId = searchParams.get("jobId") ? Number(searchParams.get("jobId")) : undefined;
        const rankId = searchParams.get("rankId") ? Number(searchParams.get("rankId")) : undefined;
        const roleId = searchParams.get("roleId") ? Number(searchParams.get("roleId")) : undefined;

        if (isNaN(page) || isNaN(itemPerPage) || page == 0 || itemPerPage == 0) {
            return NextResponse.json({ error: "Bad Request" }, { status: HttpStatus.BAD_REQUEST });
        }

        const currentUser = await UserRepository.get(session!.user.discordId!);

        const pager = await UserRepository.getList({
            itemPerPage,
            page,
            filter: {
                isDisable,
                searchTerm,
                jobId,
                rankId,
                roleId,
            },
        });

        if (!currentUser!.isAdmin) {
            pager.items?.forEach((user) => {
                user.email = null;
            });
        }

        return NextResponse.json(pager);
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

export async function POST(request: NextRequest) {
    let body = null;
    try {
        const session = await auth();

        body = (await request.json()) as UserToCreateType;
        await UserRepository.add(body);

        const userCreated = (await UserRepository.get(body.id))?.toType();

        HistoryRepository.Add({
            action: "create",
            entityId: userCreated?.id ?? null,
            entityType: "user",
            newData: userCreated ?? null,
            oldData: null,
            userId: session!.user!.discordId!,
        });

        return NextResponse.json(userCreated);
    } catch (e) {
        ErrorLogRepository.Add({
            error: e,
            path: request.nextUrl.href,
            request: body,
            userId: (await auth())!.user!.discordId!,
            method: request.method,
        });

        console.error(e);
        if (e instanceof Error) {
            const pgError = e.cause as { code?: string; detail?: string; message?: string };

            if (pgError.code === "23505") {
                // 23505 = unique_violation (duplicate key)
                return NextResponse.json(
                    { error: "A user with this ID already exists." },
                    { status: 409 }
                );
            }
        }
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
