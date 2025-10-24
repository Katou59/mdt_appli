import { auth } from "@/auth";
import { nextResponseApiError } from "@/lib/next-response-api-error";
import RankService from "@/services/ranks-service";
import Rank from "@/types/class/Rank";
import { RankType } from "@/types/db/rank";
import { HttpStatus } from "@/types/enums/http-status-enum";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    let body: Rank[] | null = null;
    try {
        const session = await auth();
        if (!session?.user?.discordId) {
            return NextResponse.json({ error: "Unauthorize" }, { status: HttpStatus.UNAUTHORIZED });
        }

        body = (await request.json()).map((r: RankType) => new Rank(r));

        if (!body || !body[0]?.job?.id)
            return NextResponse.json({ error: "Bad request" }, { status: HttpStatus.BAD_REQUEST });

        const rankService = await RankService.create(session.user.discordId);
        const newRanks = await rankService.update(body);

        return NextResponse.json(newRanks.map((x) => x.toRankType()));
    } catch (error) {
        return nextResponseApiError(error, request, auth(), body);
    }
}
