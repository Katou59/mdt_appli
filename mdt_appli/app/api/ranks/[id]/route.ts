import { auth } from "@/auth";
import { usersTable } from "@/db/schema";
import ErrorLogRepository from "@/repositories/errorLogRepository";
import HistoryRepository from "@/repositories/historyRepository";
import RankRepository from "@/repositories/rankRepository";
import { UserRepository } from "@/repositories/userRepository";
import UserService from "@/services/userService";
import { HttpStatus } from "@/types/enums/httpStatus";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        if (!id || !Number(id)) {
            return NextResponse.json({ error: "Bad Request" }, { status: 400 });
        }

        const ranks = await RankRepository.GetList(Number(id));

        return NextResponse.json(ranks.map((x) => x.toRankType()));
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
