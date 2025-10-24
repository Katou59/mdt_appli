import ErrorLogRepository from "@/repositories/errorLogRepository";
import { HttpStatus } from "@/types/enums/httpStatus";
import CustomError from "@/types/errors/CustomError";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function NextResponseApiError(
    error: unknown,
    request: NextRequest,
    auth: Promise<Session | null>,
    body: object | null
): Promise<NextResponse> {
    ErrorLogRepository.Add({
        error: error,
        path: request.nextUrl.href,
        request: body ?? null,
        userId: (await auth)?.user?.discordId ?? null,
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
