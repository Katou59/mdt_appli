import { auth } from "@/auth";
import { NextResponseApiError } from "@/lib/NextResponseApiError";
import RankService from "@/services/rankService";
import { HttpStatus } from "@/types/enums/httpStatus";
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
        return NextResponseApiError(error, request, auth(), null);
    }
}
