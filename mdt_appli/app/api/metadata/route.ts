import { auth } from "@/auth";
import { nextResponseApiError } from "@/lib/next-response-api-error";
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

        const metadataService = await MetadataService.create(session.user.discordId);
        const result = await metadataService.get();

        return NextResponse.json(result, { status: HttpStatus.OK });
    } catch (error) {
        return nextResponseApiError(error, request, auth(), null);
    }
}
