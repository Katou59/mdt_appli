import { auth } from "@/auth";
import ErrorLogRepository from "@/repositories/error-log-repository";
import MetadataService from "@/services/metadata-service";
import { HttpStatus } from "@/types/enums/http-status-enum";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        const result = await MetadataService.create(session.user.discordId);

        return NextResponse.json(result, { status: HttpStatus.OK });
    } catch (error) {
        ErrorLogRepository.Add({
            error: error,
            path: request.nextUrl.href,
            request: null,
            userId: (await auth())!.user!.discordId!,
            method: request.method,
        });
        console.error(error);

        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: HttpStatus.INTERNAL_SERVER_ERROR }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
        return;
    }
}
