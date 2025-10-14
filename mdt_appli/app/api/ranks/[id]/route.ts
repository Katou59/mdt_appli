import { auth } from "@/auth";
import HistoryRepository from "@/repositories/historyRepository";
import RankRepository from "@/repositories/rankRepository";
import { UserRepository } from "@/repositories/userRepository";
import { HttpStatus } from "@/types/enums/httpStatus";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        if (!id || !Number(id)) {
            return NextResponse.json({ error: "Bad Request" }, { status: 400 });
        }

        const session = await auth();

        const rank = await RankRepository.Get(Number(id));

        const pager = await UserRepository.getList({
            rankId: Number(id),
            itemPerPage: 20,
            page: 1,
        });
        if (pager?.items && pager.items.length > 0) {
            return NextResponse.json({ error: "Users with this rank exist" }, { status: 409 });
        }

        await RankRepository.Delete(Number(id));

        HistoryRepository.Add({
            action: "delete",
            entityId: id,
            entityType: "rank",
            newData: null,
            oldData: rank,
            userId: session!.user!.discordId!,
        });

        return NextResponse.json({ status: 200 });
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

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        if (!id || !Number(id)) {
            return NextResponse.json({ error: "Bad Request" }, { status: 400 });
        }

        const ranks = await RankRepository.GetList(Number(id));

        return NextResponse.json(ranks.map((x) => x.toRankType()));
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
