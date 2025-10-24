import { auth } from "@/auth";
import { nextResponseApiError } from "@/lib/next-response-api-error";
import UserService from "@/services/user-service";
import { UserToUpdateType } from "@/types/db/user";
import { HttpStatus } from "@/types/enums/http-status-enum";
import { NextRequest, NextResponse } from "next/server";

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
        return await nextResponseApiError(error, request, auth(), null);
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
        return await nextResponseApiError(error, request, auth(), null);
    }
}
