import { NextRequest, NextResponse } from "next/server";
import RankRepository from "@/repositories/rankRepository";
import { RankType } from "@/types/db/rank";
import Rank from "@/types/class/Rank";

export async function PUT(request: NextRequest) {
	try {
		const ranks = (await request.json()).map((r: RankType) => new Rank(r));

		await RankRepository.AddOrUpdateList(ranks);

		const results = await RankRepository.GetList(ranks[0].job.id); // TODO
		return NextResponse.json(results.map((r) => r.toRankType()));
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e }, { status: 500 });
	}
}
