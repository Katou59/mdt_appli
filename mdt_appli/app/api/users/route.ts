import { NextRequest, NextResponse } from "next/server";
import { UserToCreateType } from "@/types/db/user";
import { auth } from "@/auth";
import { UserRepository } from "@/repositories/userRepository";
import { HttpStatus } from "@/types/enums/httpStatus";
import HistoryRepository from "@/repositories/historyRepository";
import ErrorLogRepository from "@/repositories/errorLogRepository";
import UserService from "@/services/userService";
import CustomError from "@/types/errors/CustomError";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page"));
        const itemPerPage = Number(searchParams.get("itemPerPage"));
        const searchTerm = searchParams.get("searchTerm") ?? undefined;
        const isDisable =
            searchParams.get("isDisable") === "true"
                ? true
                : searchParams.get("isDisable") === "false"
                ? false
                : undefined;

        const filters = {
            isDisable,
            jobId: searchParams.get("jobId") ? Number(searchParams.get("jobId")) : undefined,
            rankId: searchParams.get("rankId") ? Number(searchParams.get("rankId")) : undefined,
            roleId: searchParams.get("roleId") ? Number(searchParams.get("roleId")) : undefined,
            searchTerm,
        };

        if (!page || !itemPerPage || isNaN(page) || isNaN(itemPerPage)) {
            return NextResponse.json({ error: "Bad Request" }, { status: HttpStatus.BAD_REQUEST });
        }

        const userService = await UserService.create(session.user.discordId);
        const pager = await userService.getList(page, itemPerPage, filters);

        return NextResponse.json(pager);
    } catch (error) {
        await ErrorLogRepository.Add({
            error,
            path: request.nextUrl.href,
            request: null,
            userId: (await auth())?.user?.discordId ?? "",
            method: request.method,
        });

        if (error instanceof CustomError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function POST(request: NextRequest) {
    let body = null;
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        body = (await request.json()) as UserToCreateType;
        const userService = await UserService.create(session.user.discordId);

        const userCreated = await userService.add(body);

        return NextResponse.json(userCreated.toType(), { status: HttpStatus.CREATED });
    } catch (e) {
        ErrorLogRepository.Add({
            error: e,
            path: request.nextUrl.href,
            request: body,
            userId: (await auth())!.user!.discordId!,
            method: request.method,
        });

        console.error(e);
        if (e instanceof CustomError) {
            return NextResponse.json({ error: e.message }, { status: e.status });
        }
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
