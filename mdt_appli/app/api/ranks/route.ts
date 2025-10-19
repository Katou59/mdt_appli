import { NextRequest, NextResponse } from "next/server";
import RankRepository from "@/repositories/rankRepository";
import { RankType } from "@/types/db/rank";
import Rank from "@/types/class/Rank";
import { HttpStatus } from "@/types/enums/httpStatus";
import HistoryRepository from "@/repositories/historyRepository";
import { auth } from "@/auth";
import ErrorLogRepository from "@/repositories/errorLogRepository";

export async function PUT(request: NextRequest) {
    let body: Rank[] | null = null;
    try {
        const session = await auth();
        body = (await request.json()).map((r: RankType) => new Rank(r));

        if (!body || !body[0]?.job?.id)
            return NextResponse.json({ error: "Bad request" }, { status: HttpStatus.BAD_REQUEST });

        const oldRanks = await RankRepository.GetList(body[0].job.id);

        // suppression des grades
        for (const oldRank of oldRanks) {
            const rankToKeep = body?.find((x) => x.id === oldRank.id);
            if (!rankToKeep) {
                await RankRepository.Delete(oldRank.id!);
            }
        }

        await RankRepository.AddOrUpdateList(body);

        const results = await RankRepository.GetList();

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
        ErrorLogRepository.Add({
            error: error,
            path: request.nextUrl.href,
            request: body,
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
