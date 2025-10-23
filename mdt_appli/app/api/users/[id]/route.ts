import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/repositories/userRepository";
import { auth } from "@/auth";
import { HttpStatus } from "@/types/enums/httpStatus";
import ErrorLogRepository from "@/repositories/errorLogRepository";
import HistoryRepository from "@/repositories/historyRepository";
import { UserToUpdateType } from "@/types/db/user";
import RankRepository from "@/repositories/rankRepository";
import UserService from "@/services/userService";
import CustomError from "@/types/errors/CustomError";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();

        if (!session?.user?.discordId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await context.params;

        const userService = await UserService.create(session.user.discordId);
        const user = await userService.get(id);

        return NextResponse.json(user.toType(), { status: HttpStatus.OK });
    } catch (error) {
        ErrorLogRepository.Add({
            error: error,
            path: request.nextUrl.href,
            request: null,
            userId: (await auth())!.user!.discordId!,
            method: request.method,
        });
        if (error instanceof CustomError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
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
        if (!session?.user?.discordId) {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        body = (await request.json()) as UserToUpdateType;
        if (!body?.id) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

        const userService = await UserService.create(session.user.discordId);
        const userUpdated = await userService.update(body);

        return NextResponse.json(userUpdated.toType(), { status: HttpStatus.OK });
    } catch (error) {
        ErrorLogRepository.Add({
            error: error,
            path: request.nextUrl.href,
            request: body,
            userId: (await auth())!.user!.discordId!,
            method: request.method,
        });
        if (error instanceof CustomError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
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
