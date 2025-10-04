import RankRepository from "@/repositories/rankRepository";
import { UserRepository } from "@/repositories/userRepository";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await context.params;
		if (!id || !Number(id)) {
			return NextResponse.json({ error: "Bad Request" }, { status: 400 });
		}

		const users = await UserRepository.getList({ rankId: Number(id) });
		if (users && users.length > 0) {
			return NextResponse.json({ error: "Users with this rank exist" }, { status: 409 });
		}

		await RankRepository.delete(Number(id));

		return NextResponse.json({ status: 200 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e }, { status: 500 });
	}
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
	try {
		const c = await request.nextUrl.pathname;
		const { id } = await context.params;

		if (!id || !Number(id)) {
			return NextResponse.json({ error: "Bad Request" }, { status: 400 });
		}

		const ranks = await RankRepository.GetList(Number(id));

		return NextResponse.json(ranks.map((x) => x.toRankType()));
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e }, { status: 500 });
	}
}
