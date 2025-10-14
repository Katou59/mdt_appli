import { NextRequest, NextResponse } from "next/server";
import RankRepository from "@/repositories/rankRepository";
import { RankType } from "@/types/db/rank";
import Rank from "@/types/class/Rank";
import { HttpStatus } from "@/types/enums/httpStatus";
import HistoryRepository from "@/repositories/historyRepository";
import { auth } from "@/auth";

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        const ranks = (await request.json()).map((r: RankType) => new Rank(r));

        const oldRanks = await RankRepository.GetList(ranks[0].job.id);

        await RankRepository.AddOrUpdateList(ranks);

        const results = await RankRepository.GetList(ranks[0].job.id);

        const newRanks = results.map((r) => r.toRankType());
        HistoryRepository.Add({
            action: "update",
            entityId: null,
            entityType: "rank",
            newData: newRanks,
            oldData: oldRanks,
            userId: session!.user!.discordId!,
        });

        return NextResponse.json(newRanks);
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
