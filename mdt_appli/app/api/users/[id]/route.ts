import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/repositories/userRepository";
import { auth } from "@/auth";
import { HttpStatus } from "@/types/enums/httpStatus";
import ErrorLogRepository from "@/repositories/errorLogRepository";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();

        if (!session?.user?.discordId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const currentUser = await UserRepository.get(session.user.discordId);
        if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await context.params;

        const userResult = await UserRepository.get(id);

        if (!userResult) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!currentUser.isAdmin && currentUser.id !== userResult.id) {
            userResult.email = null;
        }

        return NextResponse.json(userResult);
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
