import JobRepository from "@/repositories/jobRepository";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		return NextResponse.json(await JobRepository.getList());
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e }, { status: 500 });
	}
}
