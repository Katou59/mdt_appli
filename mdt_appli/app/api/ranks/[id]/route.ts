import { auth } from "@/auth";
import { nextResponseApiError } from "@/lib/next-response-api-error";
import RankService from "@/services/ranks-service";
import { HttpStatus } from "@/types/enums/http-status-enum";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }
        const { id } = await context.params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: "Bad Request" }, { status: 400 });
        }

        const rankService = await RankService.create(session.user.discordId);
        const ranks = await rankService.getList(Number(id));

        return NextResponse.json(ranks.map((x) => x.toRankType()));
    } catch (error) {
        return nextResponseApiError(error, request, auth(), null);
    }
}
