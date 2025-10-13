import GenderRepository from "@/repositories/genderRepository";
import { HttpStatus } from "@/types/enums/httpStatus";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json(await GenderRepository.getList(), { status: HttpStatus.OK });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e }, { status: HttpStatus.BAD_REQUEST });
    }
}