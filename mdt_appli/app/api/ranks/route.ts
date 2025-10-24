import { auth } from "@/auth";
import { NextResponseApiError } from "@/lib/NextResponseApiError";
import RankService from "@/services/rankService";
import Rank from "@/types/class/Rank";
import { RankType } from "@/types/db/rank";
import { HttpStatus } from "@/types/enums/httpStatus";
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
        return NextResponseApiError(error, request, auth(), body);
    }
}
