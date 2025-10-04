import { NextRequest, NextResponse } from "next/server";
import RankRepository from "@/repositories/rankRepository";
import { auth } from "@/auth";
import { RankType } from "@/types/db/rank";
import { UserRepository } from "@/repositories/userRepository";
import Rank from "@/types/class/Rank";

export async function GET() {
	try {
		const results = await RankRepository.GetList();
		return NextResponse.json(results.map((r) => r.toRankType()));
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.discordId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const currentUser = await UserRepository.get(session.user.discordId);
		if (currentUser?.isDisable || !currentUser?.isAdmin) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const ranks = (await request.json()).map((r: RankType) => new Rank(r));

		await RankRepository.AddOrUpdateList(ranks);

		const results = await RankRepository.GetList();
		return NextResponse.json(results.map((r) => r.toRankType()));
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e }, { status: 500 });
	}
}
