import { auth } from "@/auth";
import ErrorLogRepository from "@/repositories/error-log-repository";
import NationalityRepository from "@/repositories/nationality-repository";
import { HttpStatus } from "@/types/enums/http-status-enum";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json(await NationalityRepository.getList(), { status: HttpStatus.OK });
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
