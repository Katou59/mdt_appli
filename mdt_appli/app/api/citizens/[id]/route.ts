import { auth } from "@/auth";
import { nextResponseApiError } from "@/lib/next-response-api-error";
import CitizenService from "@/services/citizen-service";
import { CitizenToUpdateType } from "@/types/db/citizen";
import { HttpStatus } from "@/types/enums/http-status-enum";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    let body: CitizenToUpdateType | null = null;
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        body = await request.json();
        if (!body?.id)
            return NextResponse.json({ error: "Bad Request" }, { status: HttpStatus.BAD_REQUEST });

        const { id } = await context.params;
        if (!id || id !== body.id)
            return NextResponse.json({ error: "Bad Request" }, { status: HttpStatus.BAD_REQUEST });

        const citizenService = await CitizenService.create(session.user.discordId);
        const result = await citizenService.update(body);

        return NextResponse.json(result, { status: HttpStatus.OK });
    } catch (error) {
        return await nextResponseApiError(error, request, auth(), body);
    }
}
