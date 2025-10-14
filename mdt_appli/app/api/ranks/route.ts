import { NextRequest, NextResponse } from "next/server";
import RankRepository from "@/repositories/rankRepository";
import { RankType } from "@/types/db/rank";
import Rank from "@/types/class/Rank";
import { HttpStatus } from "@/types/enums/httpStatus";

export async function PUT(request: NextRequest) {
    try {
        const ranks = (await request.json()).map((r: RankType) => new Rank(r));

        await RankRepository.AddOrUpdateList(ranks);

        const results = await RankRepository.GetList(ranks[0].job.id); // TODO
        return NextResponse.json(results.map((r) => r.toRankType()));
    } catch (error) {
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
